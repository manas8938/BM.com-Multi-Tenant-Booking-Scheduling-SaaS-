# BookFlow — Build Progress

## Task 1 — Auth & Onboarding ✅
Files: client.ts, server.ts, middleware.ts, auth/actions.ts, signup, login, forgot-password, reset-password, onboarding, dashboard/layout+page
Decisions: email confirm OFF, slugs sanitized server-side, `getUser()` everywhere, RLS-only multi-tenancy

## Task 1 (cont.) — Core CRUD ✅
**Status:** Complete

### Files built
| File | Purpose |
|------|---------|
| `src/lib/supabase/server-utils.ts` | `requireBusiness()` — shared auth+tenant guard |
| `src/components/NavLink.tsx` | Client nav with active state via `usePathname` |
| `src/components/DeleteButton.tsx` | Client delete button with `confirm()` dialog |
| `src/app/dashboard/layout.tsx` | Redesigned — indigo brand, NavLink active states, outlined logout |
| `src/app/dashboard/page.tsx` | Overview — stat cards (live counts), manage quick-links |
| `src/app/dashboard/branches/` | page.tsx + actions.ts — create/edit/delete |
| `src/app/dashboard/staff/` | page.tsx + actions.ts — create/edit/delete, branch dropdown |
| `src/app/dashboard/services/` | page.tsx + actions.ts — price in dollars → stored as cents |
| `src/app/dashboard/availability/` | page.tsx + actions.ts — per-staff weekly slots |
| `src/app/dashboard/bookings/page.tsx` | Placeholder (real data in Task 5) |

### Decisions
- CRUD pattern: searchParams `?new=1` / `?edit=id` for inline forms (no extra route files)
- `requireBusiness()` used in every page + action — prevents cross-tenant access
- RLS is primary guard; `.eq('business_id', business.id)` in actions is belt-and-suspenders
- Price stored as integer cents (no float rounding errors)
- Availability: staff selector via searchParams; no edit (delete + re-add is sufficient for slots)

---

## Task 2 — Slot Engine + Public Booking 🔲
## Task 3 — Realtime + Email 🔲
## Task 4 — Stripe 🔲
## Task 5 — Dashboard Analytics + Bookings View 🔲
## Task 6 — Polish & Error Handling 🔲
## Task 7 — Deploy to Vercel 🔲
## Task 8 — Documentation & Portfolio Materials 🔲
