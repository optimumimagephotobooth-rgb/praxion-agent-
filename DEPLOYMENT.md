# Vercel Deploy SOP — Automation Core

## 1) Pre-Deploy (2 minutes)
- Ensure repo is pushed to GitHub
- Confirm `.env` files are **not** committed

## 2) Vercel Project Setup
- Import the GitHub repo
- Framework preset: **Next.js**
- Node version: **18.x**
- Build command: `next build`
- Output: default

## 3) Set Environment Variables
Add in **Vercel → Settings → Environment Variables**:

```
NEXT_PUBLIC_APP_URL=https://<your-domain>
N8N_WEBHOOK_URL=https://<your-n8n-domain>/webhook/exec/events
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_xxx
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## 4) Deploy
- Click **Deploy** (or push to main branch)

## 5) Post-Deploy Smoke Test (Required)
- Open `/customers`
- Add customer → validation works
- Ready banner flips correctly
- Activate → success toast + status ACTIVE
- Deactivate → confirmation + status TERMINATED
- Check `POST /api/customers/activate` returns `{ success: true }`
- Check `POST /api/customers/deactivate` returns `{ success: true }`
- n8n log receives event (no SMS/voice unless enabled)
# Vercel Deploy SOP — Automation Core

## 1) Pre-Deploy (2 minutes)
- Ensure repo is pushed to GitHub
- Confirm `.env` files are not committed

## 2) Vercel Project Setup
- Import the GitHub repo
- Framework preset: Next.js
- Node version: 18.x
- Build command: `next build`
- Output: default

## 3) Set Environment Variables
Add in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://<your-domain>
N8N_WEBHOOK_URL=https://<your-n8n-domain>/webhook/exec/events
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_xxx
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## 4) Deploy
- Click Deploy (or push to main branch)

## 5) Post-Deploy Smoke Test (Required)
- Open `/customers`
- Add customer → validation works
- Ready banner flips correctly
- Activate → success toast + status ACTIVE
- Deactivate → confirmation + status TERMINATED
- Check `POST /api/customers/activate` returns `{ "success": true }`
- Check `POST /api/customers/deactivate` returns `{ "success": true }`
- n8n log receives event (no SMS/voice unless enabled)
