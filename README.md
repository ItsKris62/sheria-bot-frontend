# SheriaBot Fintech Regulatory Platform (Frontend)

Next.js 15 (App Router) + React 19 + Tailwind CSS + tRPC Client platform for SheriaBot.

---

## 1. Setup & Environment Configuration

### Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x or npm >= 10.x

### Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Key environment variables:
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Fastify backend URL (`http://localhost:4000` or production API) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `NEXT_PUBLIC_APP_URL` | Frontend canonical URL (`http://localhost:3000` or `https://app.sheriabot.com`) |

---

## 2. Authentication & Guarded Routing

The frontend enforces strict authentication guards and profile synchronization:
- **`components/auth-guard.tsx`:** Intercepts route navigation, checks session tokens, and gracefully redirects unauthenticated visitors to `/login`.
- **`app/auth/callback/page.tsx`:** Handles Supabase Auth magic links and email confirmations, extracts tokens, sets access cookies, resolves user profile via `trpc.auth.me`, and routes users to `/onboarding` (if workspace is missing) or the active dashboard (`/startup`, `/regulator`, `/admin`).

---

## 3. Available Scripts

```bash
# Run local development server:
npm run dev

# Run full frontend test suite (45 files, 206 tests):
npm run test

# Typecheck:
npx tsc --noEmit

# Production build:
npm run build
```
