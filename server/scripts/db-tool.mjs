// CS Vault — Remote DB Tool
// Single-file local web page to push schema + seed a remote PostgreSQL database
// (e.g. the Render external database URL) without breaking local SQLite dev.
//
// Usage:  cd server && npm run db:tool   →  open http://localhost:4545
//
// What "Push Schema + Seed" does, in order:
//   1. Temporarily switches prisma/schema.prisma provider to "postgresql"
//   2. Regenerates the Prisma client
//   3. prisma db push (creates/updates tables on the remote DB)
//   4. Runs prisma/seed.ts against the remote DB
//   5. Restores the schema to "sqlite" and regenerates for local dev
// The schema is restored even if a step fails.

import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_DIR = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(SERVER_DIR, 'prisma', 'schema.prisma');
const PORT = 4545;

let running = false;
const sseClients = new Set();

function log(line) {
  const msg = `data: ${JSON.stringify(line)}\n\n`;
  for (const res of sseClients) res.write(msg);
  console.log(line);
}

function run(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    log(`$ ${cmd} ${args.join(' ')}`);
    const child = spawn(cmd, args, {
      cwd: SERVER_DIR,
      shell: process.platform === 'win32',
      env: { ...process.env, ...env },
    });
    child.stdout.on('data', d => d.toString().split(/\r?\n/).filter(Boolean).forEach(l => log(`  ${l}`)));
    child.stderr.on('data', d => d.toString().split(/\r?\n/).filter(Boolean).forEach(l => log(`  ${l}`)));
    child.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with code ${code}`))));
    child.on('error', reject);
  });
}

function killEngines() {
  // Free the Prisma engine binaries (locked by a running dev server) so generate can replace them
  if (process.platform !== 'win32') return Promise.resolve();
  return run('taskkill', ['/IM', 'query-engine-windows.exe', '/F']).catch(() => {});
}

function normalizeUrl(url) {
  url = url.trim();
  if (url.startsWith('postgres') && !url.includes('?')) url += '?sslmode=require';
  return url;
}

function setProvider(provider) {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const updated = schema.replace(/provider = "(sqlite|postgresql)"/, `provider = "${provider}"`);
  fs.writeFileSync(SCHEMA_PATH, updated);
  log(`schema.prisma provider set to "${provider}"`);
}

function currentProvider() {
  const m = fs.readFileSync(SCHEMA_PATH, 'utf8').match(/provider = "(sqlite|postgresql)"/);
  return m ? m[1] : 'unknown';
}

async function testConnection(url) {
  // prisma db execute infers the provider from the URL — no schema swap needed
  await new Promise((resolve, reject) => {
    const child = spawn('npx', ['prisma', 'db', 'execute', '--url', url, '--stdin'], {
      cwd: SERVER_DIR,
      shell: process.platform === 'win32',
    });
    child.stdin.write('SELECT 1;');
    child.stdin.end();
    let err = '';
    child.stderr.on('data', d => (err += d.toString()));
    child.on('close', code => (code === 0 ? resolve() : reject(new Error(err.trim() || `exit ${code}`))));
    child.on('error', reject);
  });
}

async function pushAndSeed(url, adminEmail, adminPassword, force) {
  const originalProvider = currentProvider();
  const env = { DATABASE_URL: url };
  if (adminEmail) env.ADMIN_EMAIL = adminEmail;
  if (adminPassword) env.ADMIN_PASSWORD = adminPassword;
  if (force) env.FORCE_SEED = '1';

  try {
    setProvider('postgresql');
    await killEngines();
    await run('npx', ['prisma', 'generate']);
    log('');
    log('── Pushing schema to remote database…');
    await run('npx', ['prisma', 'db', 'push', '--skip-generate'], env);
    log('');
    log('── Seeding remote database…');
    await run('npx', ['tsx', 'prisma/seed.ts'], env);
    log('');
    log('✅ Remote database seeded successfully.');
  } finally {
    log('');
    log('── Restoring local schema…');
    setProvider(originalProvider === 'unknown' ? 'sqlite' : 'sqlite');
    await killEngines();
    await run('npx', ['prisma', 'generate']).catch(e => log(`⚠ Local regenerate failed: ${e.message} — run "npx prisma generate" manually.`));
    log('Local schema restored (sqlite).');
  }
}

const PAGE = /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>CS Vault — Remote DB Tool</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1117; color: #e2e8f0; font-family: ui-sans-serif, system-ui, sans-serif; padding: 2rem; }
  .wrap { max-width: 820px; margin: 0 auto; }
  h1 { font-size: 1.4rem; margin-bottom: .25rem; }
  .sub { color: #94a3b8; font-size: .85rem; margin-bottom: 1.5rem; }
  .card { background: #1a1d27; border: 1px solid #2a2d3a; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
  label { display: block; font-size: .8rem; color: #94a3b8; margin: .75rem 0 .3rem; }
  input { width: 100%; background: #0f1117; border: 1px solid #2a2d3a; border-radius: 8px; padding: .6rem .8rem; color: #e2e8f0; font-size: .85rem; font-family: ui-monospace, monospace; }
  input:focus { outline: none; border-color: #3b82f6; }
  .row { display: flex; gap: .75rem; }
  .row > div { flex: 1; }
  .btns { display: flex; gap: .75rem; margin-top: 1.1rem; }
  button { border: none; border-radius: 8px; padding: .6rem 1.2rem; font-size: .85rem; font-weight: 600; cursor: pointer; }
  button:disabled { opacity: .45; cursor: not-allowed; }
  .primary { background: #2563eb; color: #fff; }
  .danger  { background: #b45309; color: #fff; }
  .warn { background: #451a03; border: 1px solid #92400e55; color: #fbbf24; font-size: .8rem; border-radius: 8px; padding: .7rem .9rem; margin-top: 1rem; line-height: 1.5; }
  #log { background: #07080c; border: 1px solid #2a2d3a; border-radius: 8px; padding: .9rem; height: 380px; overflow-y: auto; font-family: ui-monospace, monospace; font-size: .76rem; white-space: pre-wrap; color: #9ca3af; }
  #log .ok { color: #34d399; } #log .err { color: #f87171; } #log .cmd { color: #60a5fa; }
  #status { font-size: .8rem; margin-bottom: .5rem; color: #94a3b8; }
</style>
</head>
<body>
<div class="wrap">
  <h1>🗄️ CS Vault — Remote DB Tool</h1>
  <div class="sub">Push schema and seed a remote PostgreSQL database (Render external URL). Runs locally — nothing leaves this machine except the DB connection.</div>

  <div class="card">
    <label>External Database URL</label>
    <input id="url" type="password" placeholder="postgresql://user:password@host.region-postgres.render.com/dbname" autocomplete="off" />
    <div class="row">
      <div>
        <label>Admin email (optional — default admin@csvault.com)</label>
        <input id="adminEmail" type="text" placeholder="admin@csvault.com" autocomplete="off" />
      </div>
      <div>
        <label>Admin password (optional — default Admin@123)</label>
        <input id="adminPassword" type="password" placeholder="••••••••" autocomplete="off" />
      </div>
    </div>
    <div class="btns">
      <button class="primary" id="testBtn" onclick="act('test')">Test Connection</button>
      <button class="danger" id="seedBtn" onclick="act('seed')">Push Schema + Seed</button>
    </div>
    <label style="display:flex;align-items:center;gap:.5rem;margin-top:.9rem;cursor:pointer">
      <input id="force" type="checkbox" style="width:auto" />
      <span style="font-size:.8rem;color:#fbbf24">Force reseed — wipe existing topics/questions/documents (and user progress) even if content already exists</span>
    </label>
    <div class="warn">
      ℹ️ Seeding only inserts content into an <b>empty</b> database — existing content edited via the Admin panel is never overwritten unless "Force reseed" is checked. Users and the admin account are always kept. Stop the local dev server first (it locks the Prisma engine).
    </div>
  </div>

  <div class="card">
    <div id="status">Idle</div>
    <div id="log"></div>
  </div>
</div>
<script>
  const logEl = document.getElementById('log');
  const statusEl = document.getElementById('status');
  const es = new EventSource('/logs');
  es.onmessage = e => {
    const line = JSON.parse(e.data);
    const div = document.createElement('div');
    div.textContent = line;
    if (line.startsWith('$')) div.className = 'cmd';
    if (line.startsWith('✅')) div.className = 'ok';
    if (line.startsWith('❌') || line.startsWith('⚠')) div.className = 'err';
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  };

  async function act(kind) {
    const url = document.getElementById('url').value.trim();
    if (!url) return alert('Paste the external database URL first.');
    const force = document.getElementById('force').checked;
    if (kind === 'seed' && force && !confirm('Force reseed will WIPE topics/questions/documents and all user progress on the target database. Continue?')) return;
    setBusy(true, kind === 'seed' ? 'Seeding…' : 'Testing connection…');
    try {
      const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: kind,
          url,
          adminEmail: document.getElementById('adminEmail').value.trim(),
          adminPassword: document.getElementById('adminPassword').value,
          force,
        }),
      });
      const data = await res.json();
      statusEl.textContent = data.ok ? 'Done' : 'Failed — see log';
    } catch (e) {
      statusEl.textContent = 'Failed: ' + e.message;
    } finally {
      setBusy(false);
    }
  }
  function setBusy(busy, label) {
    document.getElementById('testBtn').disabled = busy;
    document.getElementById('seedBtn').disabled = busy;
    if (label) statusEl.textContent = label;
    else if (!busy && statusEl.textContent.endsWith('…')) statusEl.textContent = 'Idle';
  }
</script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(PAGE);
  }
  if (req.method === 'GET' && req.url === '/logs') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('data: "Log stream connected."\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }
  if (req.method === 'POST' && req.url === '/run') {
    if (running) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, error: 'A run is already in progress' }));
    }
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', async () => {
      running = true;
      let ok = true;
      try {
        const { action, url, adminEmail, adminPassword, force } = JSON.parse(body);
        const dbUrl = normalizeUrl(url);
        if (action === 'test') {
          log('── Testing connection…');
          await testConnection(dbUrl);
          log('✅ Connection successful.');
        } else if (action === 'seed') {
          await pushAndSeed(dbUrl, adminEmail, adminPassword, force);
        } else {
          throw new Error(`Unknown action: ${action}`);
        }
      } catch (e) {
        ok = false;
        log(`❌ ${e.message}`);
      } finally {
        running = false;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok }));
    });
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nCS Vault Remote DB Tool running:  http://localhost:${PORT}\n`);
});
