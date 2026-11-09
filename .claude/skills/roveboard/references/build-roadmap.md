# Build roadmap

## Stack (decided)
| Part | Tool | Why |
|---|---|---|
| Website and app | Next.js 16 (App Router) | One codebase for the marketing site and the product; easy to hire for |
| Database and login | Supabase (Postgres, Auth, Storage) | Real SQL, built-in auth, row-level security, file storage for PDFs, generous free tier |
| AI extraction | Claude API (load the `claude-api` skill when implementing) | Reads emails and PDFs and returns structured fields; no model training needed |
| Email (login, reminders) | Resend | Simple transactional email; needs the domain |
| Hosting | Vercel | Built for Next.js; preview links for every change |
| Tests | Playwright + GitHub Actions | 19 tests on every push, against a throwaway local Supabase |

**Ownership rule:** the founder creates every account (GitHub, Supabase, Vercel, Resend, AI provider, domain) under their own email and adds collaborators. The company must own its code, data and domain.

## What exists today (2026-11-09; update as it changes)

**Public site:** landing page (`app/Landing.js`), pricing (`app/pricing/`, 20-day trial, yearly first; billing paused), privacy and terms (company placeholders in `app/site.js`), "Get product updates" list (`waitlist` table).

**Accounts:** email + password with a two-step sign-up (business questions saved on `organizations`), recovery for half-finished sign-ups, onboarding page. The Google button appears once the provider is configured (not yet). "Confirm email" is off. No "forgot password" yet.

**Workspace (`app/(workspace)/`), live on Supabase with row-level security:**
- Trips: create, edit, delete (⋯ menu), cover photos, Trips list as home.
- Suppliers on a trip: add manually or reuse from "Your suppliers", photo, category, location, contact, confirmation status, notes, deposit and final balance (amount, due date, paid).
- Money summary per trip; Deadlines per trip and across all trips, with "Mark paid".
- Spreadsheet import (CSV or paste) and CSV export (round trip tested).
- Supplier directory (`/suppliers`): **derived from trip suppliers by name**, not a real company-wide record yet (see Phase 1).
- Team notes; Itinerary and Documents tabs are honest "coming soon" placeholders.
- Phone-friendly: bottom tab bar, account menu, stacked tables, bottom-sheet dialogs.

**Engineering:** migrations in `supabase/migrations/` (paused billing in `supabase/paused/`), 19 Playwright tests (`tests/`) on every push, Dependabot. Repo `ChisomUma/roveboard` (recommend private).

**Not built yet:** reminders, AI extraction, document and contract uploads, Today view, team members, billing (paused), forgot password, per-supplier currency.

## Product roadmap

**Direction:** start as the simplest supplier tracker for small group operators. Grow, phase by phase, into **the supplier operations platform for travel companies**: one place for supplier relationships, trip commitments, confirmations, payments, contracts and supplier risk. Each phase is driven by real customer demand (the trigger), not by a calendar. The early phases serve the beachhead (small tour operators and DMCs); the enterprise features come only when enterprise buyers are ready to pay.

Features marked **(A)** came from the founder's external advisory review (2026-11-09), adapted to Roveboard's stage and principles. Never show a feature on the website before it's built.

### Phase 0: finish v1 (now → the first 20 sign-ups and public launch)
The core loop for small operators, plus the gaps that block launch.
- Forgot password / reset (needs custom email via Resend for volume)
- Deadline reminder emails (Resend + a scheduled job; needs the domain)
- Today view: what needs attention across all trips (from the PRD)
- Document uploads on a supplier (Supabase Storage): confirmations, invoices, contracts as files
- AI suggestions from **pasted** supplier emails, with a review screen and the source shown for each value (never auto-save)
- Google sign-in setup; legal placeholders filled; billing (Paddle) once the company and domain exist
- **Trigger to move on:** launched, 10+ activated companies, first paying customers

### Phase 1: supplier foundation (first paying customers, still small operators)
Makes suppliers first-class, company-wide records. This is the foundation for almost every later feature, so do it **before** customers build up a lot of data.
- **Company-wide supplier profiles (A, Feature 1).** A supplier is created once and reused on every trip. Profile fields: name, category, country, location, contact people (name, role, email, phone), status (active / inactive), default payment terms (e.g. "30% deposit, balance 30 days before arrival"), default currency, notes, photo, and linked trips. Engineering: a new `supplier_profiles` table (org-level) and `suppliers` rows become **bookings** linked by `profile_id` (matches the PRD data model); backfill by grouping existing rows by name per company; the directory and "Your suppliers" picker read from profiles.
- **Multi-trip supplier view (A, Feature 6).** In the directory: active trips, pending confirmations and amount outstanding per supplier; open a supplier to see every trip that depends on it ("if this hotel lets us down, which departures are hit?").
- **Contracts, lite (A, Feature 2).** Upload agreements to a supplier profile with start date, expiry date, payment terms and cancellation terms; reminders before expiry (e.g. 60 days); link a contract to the trips it covers.
- **AI from PDFs + discrepancy checks (A, Feature 5).** Extend AI suggestions to uploaded confirmations, contracts and invoices, and compare them with what's already recorded: a different total (€4,800 vs €4,500), a changed payment deadline, dates that don't match the trip, a different traveller or room count. Discrepancies are flagged for a person to review; financial records are never changed silently.
- **Per-supplier currency** (deferred decision from 2026-11-08): bookings in EUR, GBP, USD and more within one trip, with totals per currency.
- **Team members, basic (A, Feature 8 part 1).** Invite colleagues into the company workspace (owner / member), plus an **activity history** showing who changed what and when on each trip and supplier.
- **Trigger to move on:** customers with several coordinators per company, or asking for roles, approvals or reporting

### Phase 2: teams and growing operators (10–50 staff, DMCs with several destinations)
- **Roles and permissions (A, Feature 8).** Administrator, operations (trips and confirmations), finance (payments and deadlines; read-only elsewhere), regional manager (assigned destinations), read-only. Comments on suppliers and trips, task assignments, notifications.
- **Bank-detail protection (A, Feature 5 + 8).** Supplier bank details stored once on the profile; any change is flagged ("this invoice has a different bank account from the verified one"), logged and needs a second person's approval. Payment-diversion fraud is common in travel, so this is valuable at any size. Security review required before storing bank details.
- **Supplier operations dashboard (A, section 3).** A company-wide home for managers: suppliers, active trips, pending confirmations, payments due, contracts expiring, and a "Requires attention" list. Small companies keep the Today view; this is its manager-level version.
- **Supplier performance scorecards (A, Feature 4).** Start with metrics Roveboard already has data for: confirmation reliability (confirmed by the needed date), cancellation rate, payment record, documents complete. Add post-trip team feedback (1–5 plus a comment) and incident reports. Show trends per supplier and compare suppliers in the same destination and category. Label scores clearly as based on the company's own records.
- **Contracts, full (A, Feature 2).** Version history, compare current and previous terms, renewal workflow, SLAs, insurance certificates, rate agreements.
- **Budget vs actual (A, section 4).** Expected supplier costs per trip compared with confirmed and paid amounts.
- **Reports and integrations.** Advanced exports (supplier spend, payments, performance); accounting sync with Xero or QuickBooks (integrate, don't build).
- **Trigger to move on:** responsible-travel operators asking for compliance tracking, or larger companies requesting enterprise controls

### Phase 3: responsible travel and supplier risk (an add-on module for a specific segment)
Many tour operators (for example AITO members and B Corp operators) have responsible-travel policies and supplier codes of conduct. A focused module could become a strong differentiator and possibly a paid add-on. Validate demand in interviews before building.
- **Supplier compliance management (A, Feature 3).** Requirement types per company (business registration, insurance with expiry, health and safety assessment, human rights, child protection and safeguarding, environmental practices, signed supplier code of conduct). Each supplier gets a status of **Compliant / Requires review / Non-compliant**, with evidence uploads, expiry reminders, exceptions and corrective actions, and a full audit trail. A real workflow, not just a folder of PDFs.
- **Diversity and sustainability tracking (A, Feature 7).** Supplier attributes (locally owned, women-owned, Indigenous-owned, minority-owned, local employment, environmental certifications) and reports: share of spend with locally owned suppliers, spend with women-owned businesses, certified suppliers by country.
- **Supplier concentration risk (A, section 4).** Flag heavy dependence on one supplier or group in a destination or category (e.g. "70% of accommodation nights in Marrakech are with one hotel group").
- **Partner, don't rebuild assessments:** sustainability assessment providers such as Travelife already run supplier assessments. Integrate with them or import their results rather than building assessment content (per "integrate, don't build").
- **Trigger to move on:** 2 or more enterprise prospects ready to commit budget, with their requirements written down

### Phase 4: enterprise (only with signed enterprise demand)
For companies like Intrepid (thousands of suppliers, many regions). Enterprise sales cycles are long (often 6–12 months) and come with security questionnaires, contracts and support expectations. Only start when a prospect is ready to pay for it, ideally as a design partner.
- **Single sign-on** (SAML/OIDC via the company's identity system), SCIM user provisioning
- **Multi-country / multi-region operations** with separate teams and data views per destination
- **Purchase approvals** before committing to large supplier spend
- **Supplier portal (optional for suppliers)** where suppliers submit documents and update their own details. Suppliers must never *need* an account to work with a Roveboard customer.
- **Public API and webhooks** to connect booking, finance and procurement systems (see the tooling radar)
- Enterprise trust work: security documentation, a data processing agreement, data residency options, audit logs export, and potentially SOC 2 or ISO 27001
- Enterprise pricing tier with onboarding and support commitments

### How phases map to pricing (revisit when each phase ships)
- Starter / Growth / Business (today's plans): Phases 0–1
- Business and above: Phase 2 team features
- Add-on or a higher tier: Phase 3 responsible-travel module
- Enterprise (custom): Phase 4

## Competitors and partners to research before positioning (from the advisory review)
- **TripMatrix:** supplier directories, contracts, pricing, integrations. Check its current features, target customers and prices.
- **Travelife:** supplier sustainability assessments for travel companies. More likely a partner than a competitor for Phase 3.
- The others from the GTM playbook: Tourplan, Tourwriter, Lemax, TourCMS, Rezdy, Travefy.
Verify every claim from the review (e.g. Intrepid's supplier numbers and policies) against the original source before using it in sales or marketing material.

## Engineering habits
- Commit small, with clear messages; work on a branch per milestone.
- `npm run build` and the Playwright tests must pass; every feature adds or updates a test. Check phone (390px), tablet and desktop widths before calling a screen done.
- Every new table: RLS policies **and** explicit grants, in a new migration file.
- Keep sample data realistic: it's what prospects see in demos.
- Record decisions in `decisions.md`.

## History
- **Stage 1 (Oct 2026):** clickable prototype with sample data and a browser-only demo store; deployed to Vercel.
- **Stage 2 (Nov 2026):** Supabase accounts and database with row-level security, live store, two-step sign-up, pricing page, CSV import and export, automated tests in GitHub Actions, phone-friendly layout. The public demo and sample trips were removed by founder decision (see decisions.md).
