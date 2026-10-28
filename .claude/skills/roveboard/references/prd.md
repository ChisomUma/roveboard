# Roveboard PRD

## One line
Roveboard is a trip coordination dashboard: one place for a travel company to track every supplier on a trip — what's confirmed, what's pending, what's owed and when.

## The problem
A group trip involves many **suppliers** (hotels, coaches, guides, restaurants, activity providers). Each sends emails, WhatsApp messages, PDFs and contracts with prices and payment deadlines. Coordinators keep this across inboxes, spreadsheets and calendars, so things get missed: a deposit deadline slips, a restaurant never confirms, a room count change goes unnoticed.

## Who it's for
- **Buyer / user:** trip coordinators and operations staff at tour operators, DMCs (destination management companies), travel agencies and wholesalers that run **group or custom trips with several suppliers per trip**.
- **Not users in v1:** suppliers. Hotels, drivers and guides never need an account and never pay.
- **Who pays:** the travel company, as a monthly subscription. The price is a hypothesis to test (see gtm-playbook.md).

## Running example (use it in demos, seed data and copy)
**Sunshine Travel** runs **Italy Explorer**: 12–19 September 2027, 20 travellers (it later grows to 24).

| Supplier | Provides | Example state |
|---|---|---|
| Hotel Bella Vista | 10 rooms (later 12) | Confirmed. £5,000 total, £1,000 deposit due 1 June, £4,000 balance due 1 August |
| Coastal Coaches | Airport pickup and transport | Awaiting reply. Follow up on the pickup quote |
| Maria (tour guide) | Local guide | Confirmed. No action needed |
| La Piazza Restaurant | Group dinner | Awaiting confirmation. Confirm final guest numbers |
| Blue Sea Tours | Boat trip | Confirmed. Final payment due 1 August |

The landing page mock uses a variant (Rome hotel, € amounts, 24 travellers, Alpine Coaches, Luigi's Local Guides, Pompeii Archaeological Tours). The default currency is still an open decision (see decisions.md).

## The customer workflow (8 steps)
These are steps in the customer's day, **not** eight separate features. AI is part of step 2, not its own step.

**Create trip → add supplier (manually or with AI) → review and save → track updates and deadlines.**

1. **Create a trip**: name, start and end dates, number of travellers. This creates a home for the trip; nothing is booked.
2. **Add suppliers**: either manually (name, contact, service, price, status, deposit and balance dates, notes, documents) or **with AI**: paste an email or message, or upload a confirmation or contract. Roveboard suggests the fields, and the user reviews them before clicking "Add supplier". There's no need to create the supplier first.
3. **Record supplier responses**: conversations happen in the company's own email or WhatsApp. The user records the outcome in Roveboard (status changes, notes, attached confirmations). Roveboard doesn't send supplier emails in v1.
4. **Review AI suggestions**: every suggested value is editable, shows where in the source it was found, and is saved only after confirmation.
5. **Trip dashboard**: suppliers with status and **next action** ("Deposit due 1 June", "Follow up on quote", "No action needed"), plus counts (suppliers, confirmed, pending, overdue).
6. **Deadlines and reminders**: deposits, final balances and other deadlines (such as confirming final numbers with a restaurant). Email reminders go out a few days before. The user pays through their normal channels and marks the payment as paid. **Roveboard tracks payments and never processes them.**
7. **Update when the trip changes**: e.g. 20 → 24 travellers. The user edits details, or pastes or uploads a revised confirmation and Roveboard suggests a diff ("Room count: 10 → 12. Review and confirm."). In v1 the user picks which trip and supplier a document belongs to.
8. **Reuse suppliers**: saved suppliers form the company's directory. Picking one for a new trip copies the contact details only; the new trip gets fresh arrangements (dates, rooms, price, deadlines).

### The daily view ("Today")
When a coordinator opens Roveboard in the morning, they should see what needs attention across all trips:
- Follow up with Coastal Coaches
- Review the restaurant's confirmation
- Hotel deposit due in 5 days
- 1 supplier contract ready for review

The goal: **less time searching for details, and fewer things forgotten.**

## Scope

### v1 (first iteration)
- Accounts and a company workspace (stage 2; the stage 1 prototype uses sample data)
- Trips: create, edit, list
- Suppliers on a trip: add manually or with AI, edit, status, notes, documents
- Payments per supplier: deposit and final balance (amount, currency, due date, paid or unpaid)
- Other deadlines and tasks per supplier
- AI from **pasted text first**, then **PDF uploads** (confirmations, contracts, invoices) once the basic workflow works
- Suggestion review screen with the source location shown for each value
- Trip dashboard, Deadlines view, Today view
- Supplier directory with reuse
- Email reminders for upcoming deadlines

### Later (don't build until v1 is validated)
- Connected inboxes (Gmail/Outlook) that find supplier emails for review
- Automatic matching of incoming documents to a trip and supplier
- Automatic change detection between document versions
- Team collaboration (roles, assignments, comments, activity feed)
- WhatsApp import, a calendar sync, a supplier-facing portal
- Plans by number of trips or users

### Explicitly out of scope
Finding or guaranteeing suppliers, automatic booking, processing or holding payments, decisions made without the user, and requiring supplier accounts.

**Never build; integrate instead (founder decision, 2026-10-28):** a booking engine, a website builder or a traveller CRM. These belong to tools like Travefy and Tourwriter. Roveboard connects to them (e.g. pushing confirmed supplier details into their itineraries, accounting sync with Xero/QuickBooks) and positions itself as working alongside them.

## Data model (target for stage 2)
- **Organization**: the travel company. **Membership** links users to an organization with a role.
- **Trip**: org, name, start and end dates, travellers, status.
- **Supplier** (directory, org-level): name, type (Hotel / Transport / Guide / Restaurant / Activity / Other), location, contact name, email, phone, notes.
- **Booking** (supplier on a trip): trip, supplier, service description, quantity (e.g. rooms), total price, currency, confirmation status (Pending / Confirmed / Cancelled / Awaiting reply), notes.
- **Payment**: booking, kind (deposit / balance / other), amount, currency, due date, paid_at.
- **Task / Deadline**: booking or trip, title, due date, done_at (e.g. "Confirm final numbers").
- **Document**: org, trip or booking, source type (pasted text / PDF / contract / invoice), storage path or text.
- **Suggestion**: document, target (a new booking or an existing booking), proposed fields with source spans, status (pending / accepted / rejected), reviewed_by.
- **Activity log**: who changed what and when. It supports "what changed" and later team features.

"Next action" and "overdue" are **computed** from payments, tasks and status, never stored by hand.

## Success metrics (product)
- **Activation:** within 7 days of signing up, a company creates a trip, adds 3 or more suppliers and records 1 or more payment deadline.
- **Habit:** coordinators open Roveboard on most working days while a trip is live.
- **AI value:** the share of suggestions accepted with few or no edits, and the time it takes to add a supplier.
- **Retention:** companies still active after their first trip ends, and those who create a second trip (the reuse moment).
