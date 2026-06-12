# BM.com — Multi-Tenant Booking & Scheduling SaaS

A Cal.com / Fresha-style booking platform for service businesses — salons, gyms, clinics, and consultants — to manage staff, services, availability, and customer bookings, with subscriptions and deposit payments built in.

**Live demo:** [bm-saas-anas.vercel.app](https://bm-saas-anas.vercel.app)

## Overview

BM.com lets a business owner sign up, set up their business profile, and instantly get a public booking page (`/their-business-slug`) where customers can pick a service, staff member, date, and time slot — with real-time availability and double-booking prevention. Owners manage everything from a dashboard: branches, staff, services, availability, bookings, and billing.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components, Server Actions)
- **Database & Auth:** Supabase (Postgres, Auth, Row-Level Security, Realtime)
- **Styling:** Tailwind CSS with a custom "Ink & Ember" design system
- **Payments:** Stripe (subscriptions + one-time deposit checkout)
- **Email:** Resend (transactional emails)
- **Hosting:** Vercel

## Key Features

### Multi-Tenancy & Security
Every business's data is isolated using Postgres Row-Level Security policies. Owners can only read and write their own branches, staff, services, availability, and bookings — enforced at the database level, not just in application code.

### Owner Dashboard
Full CRUD for branches, staff, services, and weekly availability schedules. An overview page shows total bookings, bookings for the current week, active staff count, and a feed of recent bookings.

### Public Booking Pages
Each business gets a unique slug (e.g. `/cosmetics-store`). The booking widget walks customers through:
1. Choose a service
2. Choose a staff member
3. Choose a date
4. Choose an available time slot
5. Enter contact details and confirm

### Real-Time Double-Booking Prevention
A Postgres unique constraint on `(staff_id, start_time)` guarantees no two bookings can occupy the same slot. Supabase Realtime pushes new bookings to every open booking page instantly, so a slot disappears from other customers' screens the moment it's taken — no stale data, no race conditions.

### Stripe Subscriptions
Businesses start on a Free plan and can upgrade to Pro via Stripe Checkout. A webhook handler listens for `checkout.session.completed` and `customer.subscription.deleted` to keep the business's subscription tier in sync automatically.

### Booking Deposits
Any service can optionally require a deposit. If set, the customer is redirected to Stripe Checkout for a one-time payment before the booking is created. On return, the booking is confirmed idempotently using the Stripe session ID — safe against duplicate submissions or page refreshes.

### Cancel-Booking Flow
Every booking is issued an unguessable cancel token. Customers can cancel their appointment via a dedicated link, with no account required.

### Transactional Email
- **Booking confirmations** — sent to the customer with appointment details and a cancellation link.
- **Staff welcome emails** — sent automatically when a staff member is added, including the business's public booking link.

### Dark Mode & Premium UI
The full dashboard and public booking pages support light/dark mode, built around the Ink & Ember color system. Auth, onboarding, cancellation, and payment-confirmation screens use a permanently dark "splash" treatment with branded gradients for a premium first impression.

## Architecture Highlights

- **Server Actions** replace traditional API routes for most mutations — forms post directly to server-side functions with no separate REST layer.
- **RLS-first security model** — access control lives in the database schema, so even a bug in application code can't leak cross-tenant data.
- **Idempotent payment flows** — both subscription upgrades (via webhook) and deposit bookings (via session ID) are designed to handle retries and duplicate events safely.
- **Optimistic realtime UI** — booking slot availability updates live via Supabase's Postgres change subscriptions.

## Project Structure

```
src/
├── app/
│   ├── [businessSlug]/        # Public booking page + deposit confirmation
│   ├── cancel/[token]/        # Public booking cancellation
│   ├── dashboard/             # Owner dashboard (branches, staff, services, etc.)
│   ├── api/webhooks/stripe/   # Stripe webhook handler
│   ├── login, signup, onboarding, etc.
├── components/                # Shared UI components (BookingFlow, DeleteButton, etc.)
└── lib/                        # Supabase clients, Stripe client, Resend email templates, slot engine
```

## Local Development

```bash
npm install
npm run dev
```

Environment variables required (see `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## License

Built as a portfolio project. Not for production use without further security review.
