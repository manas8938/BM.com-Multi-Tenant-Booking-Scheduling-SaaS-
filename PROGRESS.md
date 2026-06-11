# BookFlow — Build Progress

## Task 1 — Auth & Onboarding ✅
**Status:** Complete (pending email-confirm toggle confirmation)

### Files built
| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client (cookie-based) |
| `src/middleware.ts` | Session refresh on every request |
| `src/app/auth/actions.ts` | signup / login / logout Server Actions |
| `src/app/signup/page.tsx` | Signup form |
| `src/app/login/page.tsx` | Login form |
| `src/app/onboarding/page.tsx` | Business name + slug form |
| `src/app/onboarding/actions.ts` | createBusiness Server Action |
| `src/app/dashboard/layout.tsx` | Auth guard + business guard + nav |
| `src/app/dashboard/page.tsx` | Dashboard placeholder |

### Decisions
- Email confirmation **OFF** in Supabase Auth (required for session to exist immediately after signup)
- Slugs: server-sanitized to lowercase alphanumeric + hyphens
- `subscription_tier` defaults to `'free'` on business creation
- `getUser()` used everywhere (not `getSession()`) — validates JWT server-side
- Multi-tenancy: RLS only, no client-side filtering

### Test flow
signup → onboarding → create business → dashboard → logout → login → dashboard (skips onboarding)

---

## Task 2 — Core CRUD 🔲
Branches / Staff / Services / Availability

## Task 3 — Slot Engine + Public Booking 🔲

## Task 4 — Realtime + Email 🔲

## Task 5 — Stripe 🔲

## Task 6 — Polish & Deploy 🔲
