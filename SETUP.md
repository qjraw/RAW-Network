# RAW Network — Setup Checklist

Everything code-side is built. These are the 4 things that need your hands in dashboards.

---

## 1. Supabase — Create the table

Go to: **Supabase Dashboard > SQL Editor > New Query**

Paste and run: `scripts/supabase-schema.sql`

This creates the `submissions` table with columns for all 4 platforms.

---

## 2. n8n Cloud — Create credentials

Go to: **qrawthink.app.n8n.cloud > Settings > Credentials**

### Anthropic API Key
- Type: HTTP Header Auth
- Header Name: `x-api-key`
- Header Value: your Anthropic API key (sk-ant-...)
- **After saving, copy the credential ID from the URL** (it'll be something like `cred_abc123`)

### Supabase Service Key
- Type: HTTP Header Auth
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY`
- **Copy this credential ID too**

### n8n Environment Variables
Go to: **Settings > Variables** (or set in workflow settings)
- `SUPABASE_URL` = `https://neajzooemwxxgctsumqr.supabase.co`
- `SUPABASE_SERVICE_KEY` = your Supabase service role key

---

## 3. GitHub Secrets — Set 6 values

Go to: **github.com/qjraw/RAW-Network/settings/secrets/actions**

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | From Cloudflare dashboard > API Tokens |
| `N8N_API_KEY` | From qrawthink.app.n8n.cloud > Settings > API |
| `N8N_WEBHOOK_URL` | `https://qrawthink.app.n8n.cloud/webhook/raw-input` |
| `N8N_APPROVE_URL` | `https://qrawthink.app.n8n.cloud/webhook/approve-content` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://neajzooemwxxgctsumqr.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase > Settings > API > service_role key |

---

## 4. Credential IDs — Tell me the IDs

Once you create the credentials in n8n (step 2), give me the two credential IDs:
1. Anthropic credential ID
2. Supabase credential ID

I'll replace `YOUR_ANTHROPIC_CREDENTIAL_ID` and `YOUR_SUPABASE_CREDENTIAL_ID` in the workflow JSONs and push.

---

## What's Already Done (code-side)

- Content pipeline: Webhook > Voice Engine > 4 parallel transforms (LinkedIn, Substack, TikTok, Instagram) > Merge > Supabase > Respond
- Approval workflow: Webhook > Route action > Update Supabase status > Respond
- App UI: Input form > 4 platform cards with approve/edit/reject > History
- Deploy pipelines: GitHub Actions auto-deploy workflows to n8n + app to Cloudflare on push to main
- All credential placeholders are marked — ready for your IDs

## Revenue Flow

Substack handles payments natively. No Stripe needed. When someone subscribes or buys a Brain Bloom on Substack, the money goes directly to your connected Stripe account (Substack's built-in Stripe integration). You don't need to build or maintain any payment infrastructure.
