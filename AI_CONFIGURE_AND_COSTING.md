# AI Configure and Costing

How to enable, configure, and budget for the AI Assistant feature in CS Vault.

---

## 1. What the AI Assistant Does

The AI Assistant page (`/ai-assistant`) calls the backend route `POST /api/ai/chat` (`server/src/routes/ai.ts`), which uses the official Anthropic SDK with the model **Claude Haiku 4.5** (model ID: `claude-haiku-4-5-20251001`).

It is tuned with a CS-specific system prompt (`CS_SYSTEM_PROMPT`) covering:

- Companies Act 2013
- SEBI regulations (LODR, ICDR, etc.)
- Insolvency and Bankruptcy Code (IBC)
- FEMA
- ICSI syllabus across Foundation, Executive, and Professional levels
- Drafting board resolutions, notices, and minutes

There is also a `POST /api/ai/explain-section` endpoint that explains a specific law section in plain English.

**Access control:** with the plan system, only **Premium + AI** users (and admins) can use AI endpoints. Trial and Full Access users get a `403 PLAN_UPGRADE_REQUIRED` response.

---

## 2. Getting an Anthropic API Key

You need an **Anthropic API key** (starts with `sk-ant-`):

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign in or create an account.
2. Add billing — **Settings → Billing** — and purchase credits.
   The API is pay-as-you-go and is **separate from any Claude.ai subscription**.
3. Go to **Settings → API Keys** → **Create Key**.
4. Copy the key immediately — it is shown only once.

---

## 3. Configuring the Key

Set the key in two places:

### Local development

Edit `server/.env`:

```
ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Restart the dev server (`npm run dev`) after changing it.

### Production (Render)

1. Open the `csvault-api` service in the Render dashboard.
2. Go to **Environment**.
3. Set `ANTHROPIC_API_KEY` to your key and save — the service redeploys automatically.

### If the key is missing

The app degrades gracefully — the chat returns a "not configured" error message instead of crashing. All other features keep working.

---

## 4. Costing

Claude Haiku 4.5 is Anthropic's cheapest model:

| | Price |
|---|---|
| Input tokens | **$1 per million tokens** |
| Output tokens | **$5 per million tokens** |
| Context window | 200K tokens |

### What a chat actually costs

A typical student Q&A exchange (~1,000 tokens in, ~500 tokens out) costs about
**$0.0035 — roughly a third of a US cent** (about ₹0.30).

| Usage | Approx. monthly cost |
|---|---|
| 1,000 chats/month | ~$3.50 |
| 5,000 chats/month | ~$17.50 |
| 20,000 chats/month | ~$70 |

> These are rough estimates — actual cost depends on conversation length (see below).

### Things that increase cost

- **Chat history grows per request.** The chat route sends prior messages as context, so long conversations cost more per message. The built-in **Clear history** feature keeps this in check.
- **Long answers** (e.g., full draft resolutions) use more output tokens, which are 5× the input price.

### Recommended safeguards

1. **Set a monthly spend limit** in the Anthropic console (Settings → Billing) before giving Premium access to real users.
2. **Monitor usage** in the console's Usage dashboard.
3. The Premium plan gating already limits who can spend tokens — only assign Premium to paying users.
4. The API already has rate limiting (`express-rate-limit`) on the server; tighten it on AI routes if abuse appears.

---

## 5. Quick Reference

| Item | Value |
|---|---|
| Model | `claude-haiku-4-5-20251001` (Claude Haiku 4.5) |
| Env variable | `ANTHROPIC_API_KEY` |
| Key source | [console.anthropic.com](https://console.anthropic.com) → Settings → API Keys |
| Local config | `server/.env` |
| Production config | Render → `csvault-api` → Environment |
| Who can use it | Premium + AI plan users, and admins |
| Pricing | $1/M input tokens, $5/M output tokens |
