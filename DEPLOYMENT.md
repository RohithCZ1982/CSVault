# Hosting CS Vault on Render — Manual Step-by-Step Guide

This guide walks you through deploying CS Vault on [Render](https://render.com) by creating each resource manually in the dashboard. (If you prefer the automated route, see [Option A](#option-a-automated-blueprint-deploy) — Render reads `render.yaml` and creates everything for you.)

The deployment consists of **three resources**:

| Resource | Type | Purpose |
|---|---|---|
| `csvault-db` | PostgreSQL | Production database |
| `csvault-api` | Web Service (Node) | Express backend from `server/` |
| `csvault-ui` | Static Site | React frontend from `client/` |

---

## 0. Before You Deploy — Code Checklist

### 0.1 SQLite vs PostgreSQL — handled by the build command

Local development uses SQLite (`provider = "sqlite"` in `server/prisma/schema.prisma`), but production runs on PostgreSQL. You do **not** need to edit the schema by hand — the API build command swaps the provider during deployment:

```bash
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma && npm install --include=dev && npm run build
```

Two things this command fixes — use it **exactly** in step 2:
- `sed` switches the Prisma datasource to PostgreSQL for the production build only (your local file stays sqlite).
- `--include=dev` forces npm to install devDependencies. Render sets `NODE_ENV=production`, which otherwise makes `npm install` skip them — and TypeScript plus all `@types/*` packages are devDependencies, so the build fails with `TS7016: Could not find a declaration file for module 'express'` errors.

> The `engineType = "binary"` line in the generator block is a local Windows-ARM64 workaround — it is harmless on Render and can stay.

### 0.2 Change the default admin password

The seed script creates an admin account (default `admin@csvault.com` / `Admin@123`). Either:
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars on the API service before seeding (recommended), or
- Log in after deployment and treat the change as urgent.

### 0.3 Push the code to GitHub

Render deploys from a Git repository:

```bash
git add -A
git commit -m "prepare for render deployment"
git push origin <your-branch>
```

---

## 1. Create the PostgreSQL Database

1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** → **PostgreSQL**.
3. Fill in:
   - **Name:** `csvault-db`
   - **Database:** `csvault`
   - **User:** `csvault`
   - **Region:** pick one close to your users (e.g., `Singapore` for India) — **use the same region for all three resources**
   - **Plan:** Free
4. Click **Create Database** and wait until its status is **Available**.
5. On the database page, copy the **Internal Database URL** (starts with `postgresql://`). You'll paste it into the API service next.

> The *Internal* URL only works between Render services in the same region. The *External* URL is for connecting from your own machine (used later for seeding).

---

## 2. Create the Backend API (Web Service)

1. Click **New +** → **Web Service**.
2. Connect your GitHub account and select the CS Vault repository (and the branch you pushed).
3. Fill in:
   - **Name:** `csvault-api` *(this becomes your URL: `https://csvault-api.onrender.com` — if the name is taken, Render appends a suffix; note the final URL)*
   - **Region:** same as the database
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma && npm install --include=dev && npm run build` *(see step 0.1 for why)*
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Under **Advanced** → set **Health Check Path:** `/api/health`
5. Add **Environment Variables**:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | *paste the Internal Database URL from step 1* |
   | `JWT_SECRET` | *a long random string — e.g., run `openssl rand -hex 32` or use a password generator* |
   | `CLIENT_URL` | `https://csvault-ui.onrender.com` *(the UI URL you'll create in step 3 — fix later if the name differs)* |
   | `ANTHROPIC_API_KEY` | *your key from [console.anthropic.com](https://console.anthropic.com) — leave empty to disable the AI Assistant* |
   | `ADMIN_EMAIL` | *(optional)* admin login email for seeding |
   | `ADMIN_PASSWORD` | *(optional)* admin password for seeding |

6. Click **Create Web Service** and watch the build logs. The `npm start` command runs `prisma db push` first, which creates all tables in PostgreSQL automatically.
7. When the deploy is live, verify: open `https://csvault-api.onrender.com/api/health` — you should see `{"status":"ok","version":"1.0.0"}`.

---

## 3. Create the Frontend (Static Site)

1. Click **New +** → **Static Site**.
2. Select the same repository and branch.
3. Fill in:
   - **Name:** `csvault-ui`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add **Environment Variable**:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://csvault-api.onrender.com` *(your actual API URL from step 2 — no trailing slash)* |

   > ⚠️ Vite bakes this into the JavaScript bundle **at build time**. If you ever change it, you must trigger a redeploy of the static site.

5. After creating the site, go to its **Redirects/Rewrites** tab and add:

   | Source | Destination | Action |
   |---|---|---|
   | `/*` | `/index.html` | **Rewrite** |

   This makes React Router work on page refresh and deep links.

6. Wait for the build to finish and note the final URL.

### 3.1 Fix the CORS allowlist (if URLs differ)

If your UI ended up at a different URL than what you entered for `CLIENT_URL` in step 2:

1. Go to `csvault-api` → **Environment**.
2. Update `CLIENT_URL` to the exact UI URL (e.g., `https://csvault-ui-abc123.onrender.com`) — no trailing slash.
3. Save — the API redeploys automatically.

A wrong `CLIENT_URL` shows up as **CORS errors** in the browser console and failed logins.

---

## 4. Seed the Database (one time)

The seed creates 10 CS topics, 10 questions, 6 document templates, and the **admin account**. Two ways to run it:

### Option 1 — From your local machine (works on the free tier)

1. On the `csvault-db` page, copy the **External Database URL**.
2. From the repo on your machine:

   ```bash
   cd server
   DATABASE_URL="<external-database-url>" npx tsx prisma/seed.ts
   ```

   On Windows PowerShell:

   ```powershell
   cd server
   $env:DATABASE_URL = "<external-database-url>"
   npx tsx prisma/seed.ts
   ```

   > Make sure `schema.prisma` says `provider = "postgresql"` locally when you run this, and run `npx prisma generate` first if you had it on sqlite.

3. To use custom admin credentials, also set `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars before running.

### Option 2 — Render Shell (paid instances only)

If the API service is on a paid plan, open the service → **Shell** tab and run:

```bash
npx tsx prisma/seed.ts
```

The seed is idempotent for the admin user (re-running won't duplicate it), but it **deletes and recreates** topics/questions/documents.

---

## 5. Verify the Deployment

1. **API health:** `https://csvault-api.onrender.com/api/health` → `{"status":"ok"}`
2. **Frontend:** open the UI URL → landing page loads.
3. **Register** a new account → you should land back on the sign-in page, then log in. New accounts start on a 7-day Trial plan.
4. **Admin:** log in with the admin credentials → the Admin entry appears in the sidebar → assign plans (Trial / Full Access / Premium + AI) to users.
5. **AI Assistant** (Premium users/admin): only works if `ANTHROPIC_API_KEY` is set.

---

## 6. Free Tier Caveats

- **Cold starts:** free web services spin down after ~15 minutes of inactivity. The first request after sleep takes ~30–60 seconds. The UI (static site) is always fast; only the API sleeps.
- **Database expiry:** Render's free PostgreSQL is **deleted after 90 days**. Export your data or upgrade the database to a paid plan before then.
- **No shell:** free web services don't have the Shell tab — use seeding Option 1.
- **Build minutes:** free accounts have monthly build-minute limits; each push to the connected branch triggers a rebuild of both services.

---

## 7. Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Build fails with `TS7016: Could not find a declaration file for module 'express'` | devDependencies skipped because `NODE_ENV=production` | Add `--include=dev` to `npm install` in the build command |
| Start fails with `Error validating datasource` / `URL must start with file:` | schema still says `sqlite` at runtime | Use the full build command from step 0.1 (the `sed` part swaps the provider) |
| API logs show `P1001: Can't reach database` | Using External URL, or DB in a different region | Use the **Internal** URL; keep services in one region |
| Browser console shows CORS errors | `CLIENT_URL` doesn't match the real UI URL | Update `CLIENT_URL` on the API (exact URL, no trailing slash) |
| UI loads but all API calls fail / wrong URL | `VITE_API_URL` wrong or changed after build | Fix the env var, then **Manual Deploy → Deploy latest commit** on the static site |
| Refreshing any page gives 404 | Missing rewrite rule | Add `/*` → `/index.html` (Rewrite) on the static site |
| Login works but AI chat errors | `ANTHROPIC_API_KEY` not set | Add it in `csvault-api` → Environment |
| Everything is slow on first visit | Free tier cold start | Wait ~30s, or upgrade the API to a paid plan |

---

## Option A: Automated Blueprint Deploy

Instead of steps 1–3, you can let Render create everything from `render.yaml`:

1. **New +** → **Blueprint** → connect the repo.
2. Render detects `render.yaml` and provisions the database, API, and static site in one go (JWT secret auto-generated, DB URL auto-wired).
3. Set `ANTHROPIC_API_KEY` manually on `csvault-api` (it's marked `sync: false`).
4. Continue from [step 4 (seeding)](#4-seed-the-database-one-time).

The manual path above is useful when you want different names/regions, an existing database, or to understand what each piece does.
