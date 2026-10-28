# Decision log

Append new entries at the top: date, decision, why. Move items out of "Open" once decided.

## Decided
- **2026-10-28 · Integrate, don't build, front-office tools (founder decision):** Roveboard won't build a booking engine, website builder or traveller CRM. That's the territory of Travefy, Tourwriter and similar. Where customers use those tools, Roveboard integrates with them (e.g. sending confirmed supplier details to a Travefy/Tourwriter itinerary, accounting sync with Xero/QuickBooks). Positioning: works alongside the tools operators already use. If a future request drifts into these areas, point to this decision and propose an integration instead.
- **2026-10-28 · Contract upload (founder chose "attach and show in Documents"):** the third Add-supplier tab is now **"Email or contract"**: paste an email (optional) and/or upload a contract or confirmation (PDF, Word or image, up to 20 MB). The normal form also has "Attach contract", so documents can be added when editing. Files live in **IndexedDB** (`files.js`); supplier records keep only metadata in `documents[]`. The trip Documents tab and the `/documents` page list them, with Open. Unsaved uploads are deleted on cancel; removed or deleted ones on save or delete; everything on demo reset. Reusing a supplier never copies its documents (contracts are per trip). AI reading isn't connected, and the UI says so. **Stage 2:** Supabase Storage, then AI extraction from these files.
- **2026-10-28 · Money summary and spreadsheet import (founder approved both):**
  - Money (`tripMoney` and `MoneySummary` in `ui.js`): total, paid, still owed and overdue per trip, plus "still owed" on trip cards. Rule: unpaid amounts for **Cancelled** suppliers aren't owed; paid amounts always count. Payments without an amount are excluded and flagged. `money()` shows cents only when an amount has them.
  - Import (`app/(workspace)/import.js`): a CSV file or cells pasted from Excel/Sheets (comma, semicolon or tab). Columns are matched automatically and can be changed. Dates are read **day first** (UK). EU and US amount formats are handled. Unreadable values are left blank and flagged, never guessed. Rows are skipped if they have no name, are already on the trip, or are listed twice in the file. A template CSV is available. `.xlsx` isn't read; the user is told to save as CSV or paste. The landing FAQ was updated to say import exists.
- **2026-10-28 · Proposal round 2, landing page (founder approved all five; this reverses the earlier rejection of the waitlist):**
  - Working waitlist: `app/WaitlistForm.js` posts to `app/api/waitlist/route.js`, which appends to `data/waitlist.jsonl` (gitignored; deduped; honeypot; email required; role and trips/year optional). **Local disk only**, so it won't work on Vercel until storage moves (Supabase table recommended).
  - FAQ (7 honest answers, the `faqs` array in `Landing.js`; keep it true as features ship). Privacy Policy `/privacy` and Terms `/terms`: plain-English drafts, not legal advice. "Log in" renamed to "Try the demo". Founder note signed with `site.founderName`. A footer with legal links.
  - `app/site.js` holds `legalName`, `contactEmail` and `country` as **[placeholders] the founder must fill in before going online**.
- **2026-10-28 · Proposal round 1 (founder approves each):**
  - APPROVED: reuse saved suppliers inside a trip's "Add supplier" (pick from your suppliers, plus name suggestions; copies contact details only). Cache-proof image filenames.
  - REJECTED for now: duplicate a trip, Today view and next-action column, "due soon" warnings, going online with a real waitlist, and a single supplier record (stage 2 data model). Don't build these unless the founder asks again; it's fine to mention one when new evidence (e.g. operator feedback) supports it.
- **2026-10-28 · Upgraded to Next.js 16.4.3 and React 19.3.1** (from 15.5.9 / 19.1.1). `npm audit` reported 31 Next.js advisories, several critical (including remote code execution), and 0 after the upgrade. `next.config.mjs` pins `turbopack.root`, because of a stray `~/package-lock.json`. `app/layout.js` sets `suppressHydrationWarning` on `<html>`/`<body>`, because browser extensions (Grammarly, Scribe) inject attributes there. Run `npm audit` before every deploy.
- **2026-10-28 · Demo app rebuilt to match the dashboard design** with real URLs (`/trips/[id]` and so on) in place of a single-page view switch, so refresh, Back and shareable links work. Payments are modelled as a separate deposit and final balance per supplier, matching the design's columns. "Log in" goes to `/dashboard`, which opens the first trip. Sample currency is € to match the design, and each trip has its own currency (EUR/GBP/USD).
- **2026-10-28 · Stack:** Next.js, Supabase, Claude API for extraction, Resend, Vercel. Why: it lets the founder own the code, keeps costs low, and is easy to hire for.
- **2026-10-28 · Build in two stages:** stage 1 is an interactive prototype with sample data; stage 2 is a private pilot with real accounts, AI and reminders for 2–3 companies. Why: test the workflow with operators before paying for infrastructure.
- **2026-10-28 · AI is part of "add supplier" (step 2), not a separate step.** Start with pasted text, then PDFs (contracts, confirmations, invoices). Inbox connections and auto-matching come later. The user always reviews before saving.
- **2026-10-28 · Roveboard tracks payments and never processes them.** Suppliers never need accounts.
- **2026-10-28 · Landing page built to match the design mockup** (`app/Landing.js`). It keeps the supplier-email example and adds the supplier-contract upload. Images are placeholder crops; original exports are needed.

## Open (the founder decides; Claude recommends)
- **Beachhead market and geography.** Recommendation: UK-based small group tour operators and DMCs running European trips. Confirm.
- **Default currency** (£ in the product explanation, € in the landing mock). Recommendation: per-trip currency, with the company's default set at signup.
- **Waitlist tool.** Recommendation: Tally form now, a Supabase table in stage 2.
- **"Log in" on the landing page** currently opens the demo. Decide on "Try the demo" wording versus real login in stage 2.
- **Domain, company email, and ownership of all accounts.**
- **Pricing hypothesis** to test in interviews.
