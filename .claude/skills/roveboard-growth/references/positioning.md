# Positioning and messaging

Read this before writing any public words: page, post, email or ad. Everything else in the growth skill draws on it.

## Ideal customer profile (ICP)

**Beachhead (start here):** small-to-mid **group tour operators and DMCs**, about 2–30 staff, running group or tailor-made trips with **5 or more suppliers per trip**, coordinated today with **email, WhatsApp and spreadsheets**. Recommended first geography: UK operators running European trips (the founder confirms this; record it in `decisions.md`).

**Good signals in a prospect:** they publish group itineraries; they're hiring an "operations coordinator" or "reservations executive"; they belong to AITO, ABTA, ETOA or a regional DMC network; they mention "tailor-made", "group tours", "school trips", "incentives" or "private tours".

**Not now:** large operators with a reservation system (Tourplan, Lemax and similar) and an IT team; solo agents booking flights and hotels for individuals; OTAs.

**Later segments to test (one at a time, with a dedicated page each):** school and educational tour organisers, incentive and corporate travel, wedding and destination-event planners, faith and pilgrimage tours, sports team travel, travel agencies with a groups desk.

## Personas

| Persona | What they care about | Their trigger moment | What to show them |
|---|---|---|---|
| **Operations / trip coordinator** (main user) | Nothing slipping; not being blamed; less chasing | A missed deposit or an unconfirmed supplier days before departure | The trip dashboard with statuses, money owed and deadlines; import from their spreadsheet |
| **Founder / MD of a small operator** (buyer) | Cash flow, reputation, team scaling beyond "it's all in Sarah's head" | Busy season, a new hire, a costly mistake | Money owed and overdue across trips; set up in an afternoon; export any time (no lock-in) |
| **Groups desk lead at an agency** | Juggling many trips in parallel | Season planning | The Trips list and Deadlines view across all trips |

## The problem, in their words

Collect real phrases from interviews and add them here with the date and source (role, company type). Until then, these hypotheses come from the PRD; replace them as soon as real quotes exist:
- "Supplier details are spread across my inbox, WhatsApp and three spreadsheets."
- "I only find out a deposit was missed when the hotel releases the rooms."
- "When a group grows from 20 to 24, I have to update every supplier and hope I didn't miss one."
- "It all lives in one person's head. If they're off sick, we're stuck."

## Positioning (founder decision, 2026-11-09)

**Category line (use it identically everywhere: site, LinkedIn tagline, directories, bios, pitch decks):**
> The supplier operations platform for travel companies.

**Full positioning (founder's wording; use as written internally, in pitches and once the features exist):**
> The supplier operations platform for travel companies. One place to manage supplier relationships, trip commitments, confirmations, payments, contracts and operational risks.

**Public version until document uploads ship (the website hero uses this):**
> The supplier operations platform for travel companies. One place to manage supplier relationships, trip commitments, confirmations and payments, and to catch risks before they affect a departure.

Honesty rule for this line: add "contracts" publicly once contract/document uploads are live; describe "risks" only as what Roveboard actually flags (today: overdue payments and unconfirmed suppliers; later: contract expiry, compliance, concentration risk per the roadmap). The beachhead stays small-to-mid operators, so in outreach lead with their concrete pain (missed deposits, unconfirmed suppliers) and use the category line as the frame, not the pitch.

**Positioning statement (for sales thinking):** for **tour operators and DMCs** who **coordinate suppliers across email, WhatsApp and spreadsheets**, Roveboard is **the supplier operations platform** that **shows what's confirmed, what's owed and what's at risk across every trip**. Unlike **full reservation systems**, it **sets up in an afternoon from your existing spreadsheet**, and unlike **a spreadsheet**, it **tells you what needs action today**.

**Short boilerplate (about 50 words):**
> Roveboard is the supplier operations platform for travel companies. Tour operators, DMCs and travel agencies use it to manage their suppliers and see, for every trip, which hotels, coaches and guides are confirmed, which deposits and balances are owed, and what needs attention next. It imports your existing spreadsheet, and you can export everything any time.
(Once registered, add "Roveboard Ltd is registered in England and Wales." Don't say "built in the UK": the founder works from Nigeria, and claims must be true.)

## Message pillars (with proof)

1. **Nothing slips.** Confirmation status, deposits, balances and deadlines per supplier; the Deadlines view across all trips. *Proof:* product screenshots; pilot quotes once available.
2. **Your money at a glance.** Paid, still owed and overdue per trip. *Proof:* the money summary.
3. **Up and running in an afternoon.** Import from Excel or Google Sheets; no training; suppliers never need an account. *Proof:* a timed walkthrough video ("first trip in 10 minutes").
4. **Your data is yours.** Export everything to a spreadsheet any time; private workspace per company. *Proof:* the export button; the privacy page.
5. **Coming soon, labelled as such:** AI that reads supplier emails and contracts and suggests details for you to confirm; reminders before deadlines.

## Competitor framing

- **The real competitor is the spreadsheet plus the inbox.** Position against the status quo first: "your spreadsheet can't tell you what's due this week".
- **Full tour-operator systems** (examples to research before comparing: Tourplan, Tourwriter, Lemax, TourCMS, Rezdy, Travefy). Also research **TripMatrix** (supplier directories, contracts, pricing, integrations) and **Travelife** (supplier sustainability assessments; a likely partner for the Phase 3 responsible-travel module). Frame them as powerful but heavy: long setup, built for itineraries and bookings. Roveboard is the lightweight supplier layer. Some of them may be future integration partners (see "integrate, don't build" in `decisions.md`), so never disparage them.
- **Comparison claims must be verified and dated.** Check the competitor's current site and pricing, link the source, write "as of <month year>", and re-check every 6 months. Be fair: state what they do better. Fair comparisons get trusted, and they get cited by AI assistants.

## Words

**Use:** supplier, trip, group trip, deposit, final balance, confirmation, deadline, owed, overdue, tour operator, DMC, coordinator, spreadsheet, "see at a glance", "what's due next".

**Avoid:** revolutionise, seamless, game-changer, all-in-one, AI-powered (until the AI is built and then only describing what it actually does), "booking engine" (we don't book), "payments" as a verb (we track, never process), "industry-leading", "trusted by thousands".

**Punctuation (founder rule, 2026-11-09):** no em dashes (—) anywhere in copy, and no "statement, colon, list" constructions ("Group trips run on many conversations: a, b, c"). The founder sees both as AI tells. Use full sentences instead. Colons are fine only as labels in data or UI ("Total: €4,800"). En dashes in number and date ranges ("12–15 September") are OK.

**Spelling:** UK English for UK/EU audiences (travellers, organise). Use the currency symbol of the audience (£ in the UK, € in the EU, $ in the US).

## Pricing in marketing

Quote prices only from `app/pricing/plans.js`, and always mention the 20-day free trial (no card needed while billing is paused). Never promise discounts the pricing page doesn't show. If billing isn't live, don't run campaigns whose call to action is "buy".
