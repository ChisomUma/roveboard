# Build roadmap

## Stack (decided)
| Part | Tool | Why |
|---|---|---|
| Website and app | Next.js (App Router) | One codebase for the marketing site and the product; easy to hire for |
| Database and login | Supabase (Postgres, Auth, Storage) | Real SQL, built-in auth, file storage for PDFs, generous free tier |
| AI extraction | Claude API (load the `claude-api` skill when implementing) | Reads emails and PDFs and returns structured fields; no model training needed |
| Email reminders | Resend | Simple transactional email |
| Hosting | Vercel | Built for Next.js; preview links for every change |

**Ownership rule:** the founder creates every account (GitHub, Supabase, Vercel, Resend, AI provider, domain) under their own email and adds collaborators. The company must own its code, data and domain.

## What exists today (update as it changes)
- `app/page.js` renders `app/Landing.js` (styles in `app/landing.css`): the marketing landing page, matching the design mockup. "Log in", "Review details" and "Add supplier" link to `/dashboard`.
- `app/components/icons.js`: the shared `Icon` set and `Logo`.
- `app/(workspace)/`: the demo app, matching the dashboard design (done 2026-10-28):
  - `store.js`: a React context holding seed data (Italy Explorer 2027 with 8 suppliers, Lisbon & Porto Discovery with 2), saved to `localStorage` under `roveboard-demo-v2`. **This is the file to swap for Supabase in stage 2.**
  - `ui.js`: the shell (sidebar), pills, supplier table, payment list, and the trip and supplier forms. The forms include paste-an-email mode, with AI honestly marked as not connected.
  - Routes: `/dashboard` (redirects to the first trip), `/trips`, `/trips/[id]` (tabs Overview / Suppliers / Itinerary / Documents / Deadlines), `/suppliers` (directory with reuse), `/deadlines`, `/documents`, `/notes`.
  - Supplier shape: `{id, name, place, category, status, contact, notes, img?, photo?, deposit:{amount,due,paid}|null, balance:{...}|null}`. Stats, overdue and the next payment are computed.
  - Optional supplier photo (added 2026-10-28): click, drag or paste an image, and it's cropped to a 160px JPEG data URL (~12 KB) in `photo`. Without one, the initials tile shows. `img` is only for bundled sample images. Directory reuse copies the photo. If `localStorage` is full, a banner warns. **Stage 2:** move photos to Supabase Storage and keep a URL in place of the data URL.
- Supplier reuse inside a trip (approved 2026-10-28): "Add supplier" has three tabs, Enter manually / Your suppliers / Paste an email. "Your suppliers" is a searchable picker built from `supplierDirectory(trips)` in `ui.js`; suppliers already on the trip are disabled. Typing two or more letters of a name shows "From your suppliers" chips. Reuse copies `contactDetails()` only. Sample thumbnails are loaded through `sampleImage()` in `app/components/images.js` with a `?v=` version tag; bump `SAMPLE_IMAGE_VERSION` when sample photos change. Landing photos have descriptive unique filenames.
- The trip Overview shows a Money panel (`MoneySummary`). The trip header has "Import" (`ImportDialog` in `import.js`, which adds suppliers through the store's `addSuppliers`). Browser click-test scripts (flow, reuse, photo, waitlist, import: 85 checks) live in the session scratchpad, not the repo. Worth moving into the repo as real tests once git is set up.
- Covered steps: 1 (create trip), 2 (manual add; paste-email keeps the text as notes), 3 (status and notes), 5 (dashboard), 6 (deadlines and mark paid, no emails), 7 (edit trip and supplier), 8 (directory reuse copies contact details only).
- Not yet covered: step 4's real AI review screen with source highlighting, the Today view, a "next action" column, reminders, and the itinerary and documents tabs (honest placeholders).
- `public/images/`: real Unsplash photos (2026-10-28), replacing the earlier crops from the mockup. Sources are in `IMAGE-CREDITS.md`.
- **Git:** pushed to GitHub at `ChisomUma/roveboard` (branch `main`, remote over SSH host alias `github-second`) on 2026-10-28. It was **public** at first; recommend private, because `.claude/` holds strategy docs. Commit or push only when the founder asks.
- No automated tests in the repo, no backend, and no online waitlist yet. A click-through check was run with headless Chrome over the DevTools protocol (22 checks); the script isn't in the repo.

## Stage 1: interactive prototype (now)
Goal: a clickable, realistic product that operators can try in a 20-minute call. It uses sample data, needs no accounts and is free to host.

Milestones:
1. **Foundation**: `git init`; split `app/page.js` into routes and components (`/app/trips`, `/app/trips/[id]`, `/app/suppliers`, `/app/deadlines`, `/app/today`); one client-side store with the PRD data model; seed with the Sunshine Travel example.
2. **App shell to match the design**: navy sidebar (Trips, Suppliers, Documents, Deadlines, Notes), trip header, tabs, stat cards and the supplier table with status pills from the landing preview.
3. **Steps 1–2 and 8**: create trip, add supplier manually, pick from the directory (reuse).
4. **Steps 2 and 4 (AI, simulated)**: paste email → review screen with suggested fields, edit, highlighted source text and "Add supplier". In stage 1 the extraction can be a deterministic demo parser for the sample emails, clearly labelled as a demo.
5. **Steps 5–6**: computed "next action", Deadlines view, Today view, mark as paid, reminder preview (no emails sent).
6. **Step 7**: edit the trip and booking; paste a revised confirmation and see the suggested diff ("10 → 12 rooms").
7. **Waitlist that works**: a real form (Tally, or a simple Supabase table) with a qualifying question. See gtm-playbook.md.
8. Deploy to Vercel with a shareable demo link.

Exit criteria: 5 or more operators have clicked through it on a call, and the top confusions are fixed.

## Stage 2: private pilot (2–3 design-partner companies)
1. Supabase Auth with organization workspaces and row-level security (database rules so one company can't see another's data).
2. Move the data model to Postgres (tables from prd.md).
3. Real AI extraction: pasted text first, then PDFs via Supabase Storage. Return structured JSON with a source span for each field and never auto-save.
4. Resend reminder emails from a scheduled job (deadline minus N days, configurable).
5. Basic activity log, CSV export (so customers know they can leave) and error monitoring.
6. Trust basics: privacy policy, terms, data-processing notes (supplier contracts go to an AI provider, so disclose this, and review the provider's data-retention terms), backups.

Exit criteria: the pilot companies run at least one live trip end to end in Roveboard, and at least one says they'd pay.

## Stage 3: paid launch (after the pilot)
Billing (Stripe subscriptions), onboarding (importing an existing spreadsheet), team invites, and the "later" features the pilot data justifies.

## Engineering habits
- Commit small, with clear messages; work on a branch per milestone.
- `npm run build` must pass. Check desktop and phone widths before calling a screen done.
- Keep sample data realistic: it's what prospects see in demos.
- Record decisions in `decisions.md`.
