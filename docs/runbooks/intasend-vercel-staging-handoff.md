# IntaSend Vercel Staging Handoff

This handoff is for a Vercel Preview/staging deployment only. Do not deploy production and do not point the preview at the production backend.

## Release Coordinates

- Frontend repository directory: `fintech-regulatory-platform`
- Frontend branch: `staging/intasend-billing`
- Original IntaSend billing remediation SHA: `8df0740aeb51280b986f8c510d17c4a58606b77d`
- Post-handoff staging SHA: `2e013f6106b9c85955cbd6c1a2ba700133b4c8ac`
- Required backend target: `sheriabot-backend-staging`
- Backend target must use Development-UAT database only

## Vercel Project Settings

- Framework: Next.js
- Package manager: pnpm
- Root directory: repository root for `fintech-regulatory-platform`
- Install command from `vercel.json`: `pnpm install`
- Build command from `vercel.json`: `pnpm build`
- Dev command from `vercel.json`: `pnpm dev`
- Output: standard Next.js build output managed by Vercel

## Required Environment Variables

Set these in Vercel Preview/staging environment only. Do not commit values.

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `NEXT_PUBLIC_R2_ASSETS_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_DISABLE_INDEXING`

## Backend Target Contract

`NEXT_PUBLIC_API_URL` must target the staging backend tRPC endpoint:

```text
https://<sheriabot-backend-staging-render-host>/trpc
```

It must not point to:

- production Render backend
- local backend
- any database-backed environment other than Development-UAT

After the Render staging URL is available, set:

```text
NEXT_PUBLIC_API_URL=https://<sheriabot-backend-staging-render-host>/trpc
```

Set `NEXT_PUBLIC_APP_URL` to the Vercel Preview URL after deployment, or to the chosen staging alias if one is created.

## Manual Deployment Sequence

1. Create or select a Vercel Preview/staging project for `fintech-regulatory-platform`.
2. Connect branch `staging/intasend-billing` at SHA `2e013f6106b9c85955cbd6c1a2ba700133b4c8ac`.
3. Set Preview environment variables listed above.
4. Confirm `NEXT_PUBLIC_API_URL` targets `sheriabot-backend-staging`.
5. Deploy preview.
6. Confirm build status is ready.
7. Open the preview and run T7 from the backend UAT checklist.

## Verification

- Build completes with `pnpm build`.
- Browser network calls go to Render staging.
- Billing page reports IntaSend active behavior.
- Startup and Business purchases open M-Pesa/STK, not Stripe checkout.
- Admin billing operations call staging backend only.
