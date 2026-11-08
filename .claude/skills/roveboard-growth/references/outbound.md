# Outbound

Outbound = the founder reaches out first, to operators who match the ICP. In early-stage B2B it's the most predictable way to get conversations, pilots and the first 10–30 customers, while SEO and inbound warm up. Done well, it's personal, relevant and low volume: **tens of messages a day, not thousands**.

## Rules first (UK/EU/US); check current guidance before launching

**UK (PECR + UK GDPR), the founder's home market:**
- Emailing **corporate subscribers** (limited companies, LLPs, public bodies) at work addresses is allowed without prior consent, if you identify yourself, give a valid contact address and offer an easy opt-out in every message. You must have a lawful basis (usually legitimate interests: write a short legitimate interests assessment once and keep it), tell people where you got their data in your first message or privacy notice, and honour objections immediately and permanently (keep a suppression list).
- **Sole traders and some partnerships count as individuals:** you need prior consent to email them marketing. Many small travel businesses are sole traders. Check on Companies House: if they aren't listed as a company, don't cold-email them; use LinkedIn or a phone call instead.
- Cold calls to businesses are allowed unless the number is on the Corporate Telephone Preference Service (CTPS); screen numbers first.
- Keep records: source of each contact, date and suppression list.

**EU:** rules vary by country. Some (e.g. Germany) generally require prior consent even for B2B email; others are closer to the UK. Check each country's rules before emailing there; prefer LinkedIn for strict countries.

**US (CAN-SPAM):** B2B cold email is allowed with an accurate sender and subject, a physical postal address and a working opt-out honoured within 10 business days.

**LinkedIn:** follow the user agreement. No scraping tools or browser automation that LinkedIn prohibits (accounts get restricted). Manual outreach, or Sales Navigator, is fine.

When in doubt, check the ICO's direct marketing guidance (ico.org.uk) and note the date checked in `decisions.md`.

## 1. Building the list

**Start with 100–200 hand-picked companies**, not a bought list.
- **Sources:** association member directories (AITO, ETOA, ABTA "find a member"; respect their terms of use), trade-show exhibitor lists (WTM, ITB), Google ("group tours from UK", "DMC Italy", "school trips operator"), LinkedIn company search (industry "Travel Arrangements", 2–50 employees, region), and Companies House (SIC codes 79110 travel agency, 79120 tour operator, 79909 other reservation services) to confirm company status.
- **Contact:** the founder/MD at small companies (2–10 staff); the operations manager or groups manager at larger ones. Work emails only; find them on the company site, or verify them with a finder tool (Apollo, Hunter, both with free tiers).
- **Columns in the CRM:** company, website, segment, country, size, contact name, role, email, LinkedIn URL, legal status (company or sole trader), source, personalisation note, status.
- **Tools at trigger:** Apollo free tier for finding and verifying; LinkedIn Sales Navigator (~£80/month, check current price) once manual LinkedIn search is the bottleneck.

## 2. Personalisation (the part that gets replies)

One specific, true line per company, from 2 minutes of research:
- A trip they run ("Saw your Dolomites walking groups for 2027…")
- A hiring post for an operations or reservations role (a strong trigger: they're feeling the coordination load)
- A recent post, award, new destination or season launch
- A shared connection, association or event

Don't fake familiarity, and don't use AI-generated "I loved your recent post" filler. If there's nothing specific, use the segment's pain instead.

## 3. Sequences

**LinkedIn (warmest, start here):**
1. View their profile, and comment thoughtfully on a recent post if they have one (day 0)
2. Connection request with a short note or none (test both): "Hi <name>, I'm building a tool for group tour operators and talking to people who run supplier-heavy trips. Would love to connect." (day 1)
3. After they accept: a thank-you plus one question, no pitch: "Curious: how do you keep track of supplier deposits and confirmations across trips today?" (day 2–3)
4. If they engage: share the relevant insight or template, then offer a 15-minute walkthrough, or invite them to try it free.

**Cold email (3–4 touches over about 2 weeks, then stop):**
- **Email 1 (day 0):** personal line → the problem in their words → what Roveboard does in one sentence → a low-friction ask ("Worth a 15-minute look?" or "Want the free tracker template?") → signature with full company details and an opt-out line.
- **Email 2 (day 3), reply in the same thread:** one useful thing (the template, a short checklist), no hard pitch.
- **Email 3 (day 7):** a short proof point or pilot story (real only), and the ask again.
- **Email 4 (day 14), breakup:** "Should I close the loop? If supplier tracking isn't a priority this season, no problem. I won't follow up again."

**Writing rules:** under 100 words; plain text, no images or tracking-heavy HTML; one link at most (none in email 1 is safest for deliverability); a subject in lowercase, 2–5 words, specific ("supplier deposits at <company>"); UK English; from the founder's real name; no attachments. Templates are in `templates.md`.

**Timing:** avoid peak season crunches (check the segment: school-trip operators are busiest before Easter and summer; many European tour operators finalise suppliers in winter and spring). January to March is often good for tool adoption, before the season.

## 4. Deliverability (or nobody sees the email)

- **Separate sending domain** (e.g. `getroveboard.com`) with its own Google Workspace mailbox(es), redirecting to the main site. Never cold-email from the main domain.
- **SPF, DKIM and DMARC** on the sending domain; a custom tracking domain if you use a sequencing tool (or turn open tracking off, which also helps deliverability).
- **Warm up** new mailboxes for 2–4 weeks (real conversations, a small daily volume) before outreach.
- **Volume:** 20–40 new contacts per mailbox per day at most. Scale by adding mailboxes, not volume per mailbox.
- **Verify emails** before sending (bounce rate under 2%). Watch spam complaints: Google and Yahoo require bulk senders to stay below 0.3% (aim for under 0.1%), and every email must honour unsubscribes quickly.
- **Tools at trigger:** send manually from Gmail at first (5–15 a day is enough for the first 50 conversations). Move to a sequencing tool (Lemlist, Instantly, Smartlead, or the Apollo free tier) only when manual sending is the bottleneck, around 30+ a day.

## 5. Calls and demos

- **Discovery first (15–20 minutes):** use the "Mom Test" questions from the `roveboard` GTM playbook: their last trip, where supplier details lived, the last thing that slipped, what it cost.
- **Then the demo (10 minutes) on *their* situation:** import or recreate one of their real trips live, show deadlines and money owed. End with a concrete next step: start the trial today with you importing their spreadsheet, or book a follow-up with the decision maker.
- **Objections to prepare for:** "We use spreadsheets and it's fine" (ask about the last missed deadline); "We're too small" (Starter, setup in an afternoon); "Our reservation system does this" (does it track supplier confirmations and deposits per trip? if yes, they aren't the ICP); "No time to switch" (concierge import); "Is our data safe?" (private workspace, export any time, UK/EU hosting; check the privacy page for exact wording).

## 6. Pipeline stages (CRM)

Target → Contacted → Replied → Conversation booked → Conversation held → Trial started → Activated → Paid (or Lost, with a reason). Review weekly; the lost reasons are product and positioning feedback.

## Outbound metrics and healthy ranges (early-stage, highly targeted)

LinkedIn acceptance 25–40%; reply rate 5–15% (cold email), 10–25% (LinkedIn after connecting); conversations booked 2–5% of contacts; conversation → trial 30–50%. If replies are under 3% after 100 contacts, change the list or the message, not the volume. Record real numbers here once there's data.
