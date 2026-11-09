# Launch readiness

Full marketing (publishing, outbound, launch) starts when the **gates** below are met. Update the status column whenever something changes, with the date.

## Gates (founder decision, 2026-11-09)

| Gate | Why it matters for marketing | Status |
|---|---|---|
| **Most v1 features built** (see the `roveboard` roadmap; at minimum reminders, plus the AI suggestion feature if it's in the launch promise) | Marketing makes promises the product has to keep; trial users churn if the core loop is missing | In progress |
| **Company registered** (UK Ltd via Companies House as a non-resident director; see decisions.md 2026-11-09) | Contracts, invoices, a business bank account, payment provider verification (Paddle), credibility in outbound | Not yet |
| **Domain bought, with business email** (e.g. roveboard.co / .com / .io) | SEO authority builds on *your* domain (not vercel.app); outbound needs a proper sender; AI assistants and buyers trust a real domain | Not yet |
| **Business LinkedIn page + polished founder profile** | Main channel for B2B travel; the page is where people check you're real | Not yet |
| **Billing live** (Paddle; currently paused) | Inbound needs a path to pay; otherwise sign-ups pile up as free users | Paused |
| **Legal basics updated with the real company** (`app/site.js` placeholders: legal name, contact email, country; privacy policy; cookie notice if analytics uses cookies) | Required before collecting leads at scale; outbound emails must identify the sender | Placeholders remain |

## Start now, because it compounds (allowed before the gates)

These cost little or nothing and get more valuable the earlier they start. Recommend them, but the founder approves each one:

1. **Founder LinkedIn presence.** Update the headline and about section around the problem (not "Founder @ stealth"), and post once or twice a week about what you learn from operators. An audience takes months to build; starting at launch is late.
2. **Collect the customer's words.** Every interview and pilot conversation gets logged with exact phrases ("I live in fear of the deposit email I missed"). These become headlines, keywords and ad copy later (see `positioning.md`).
3. **Keyword and question list.** Keep collecting the questions operators ask (in interviews, forums, LinkedIn comments). Each one is a future blog post or FAQ (see `seo.md`, `blog.md`).
4. **Write the lead-magnet template.** The "Group trip supplier and deposit tracker" spreadsheet (see `blog.md`) can be written and tested with pilots now, then published at launch.
5. **Technical SEO foundations in the site** (metadata, sitemap, robots, structured data, OG images; see `seo.md`). Cheap to build, and it doesn't publish anything new. Note: on roveboard.vercel.app it only helps once the real domain is live, and moving domains later needs redirects, so time it with the domain purchase.
6. **Pick the domain early,** even if you buy it later: check it's free and has no trademark conflict in the UK and EU (UK IPO and EUIPO searches), and that the LinkedIn page name and social handles are free.
7. **Design-partner case studies.** Ask pilots now for permission to quote them later. Proof is the hardest asset to create at launch time.

## One-time setup checklist (do in this order once the gates open)

**Identity and trust**
- [ ] Domain bought (Cloudflare Registrar or Namecheap; ~£10–15/yr), connected to Vercel, with `www` → apex redirect (or the reverse) and HTTPS
- [ ] Business email on the domain (Google Workspace ~£6–7/user/mo, or Zoho Mail free tier): `hello@`, plus the founder's own address
- [ ] Email authentication: SPF, DKIM and DMARC records (start DMARC at `p=none` with reports, tighten to `quarantine` after a few weeks of clean reports)
- [ ] If doing outbound: a **separate sending domain** (e.g. `tryroveboard.com` or `getroveboard.com`) that redirects to the main site, so cold-email reputation never touches the main domain (see `outbound.md`)
- [ ] Update `app/site.js` (legal name, contact email, country), privacy policy and terms with the company's details
- [ ] Business bank account that accepts a Nigeria-based director of a UK Ltd (e.g. Wise Business; check eligibility). Tide/Starling/Monzo usually require UK-resident directors
- [ ] UK: pay the ICO data protection fee if required (most businesses handling customer personal data must; it's small, so check current tiers at ico.org.uk)

**Measurement**
- [ ] Google Search Console (domain property, verified by DNS) + submit the sitemap
- [ ] Bing Webmaster Tools (import from Search Console). Bing's index also feeds several AI assistants, so this matters for GEO too
- [ ] Product and site analytics: PostHog (free tier, on the tooling radar) with sign-up funnel events (visited pricing → started sign-up → created workspace → created first trip → added 3 suppliers). If it uses cookies, add a consent banner, or run it cookieless
- [ ] UTM convention for every link you share (`utm_source=linkedin&utm_medium=social&utm_campaign=<name>`)
- [ ] A "How did you hear about us?" answer already exists in sign-up step 2. Review it weekly; it's the most honest attribution you have

**Pipeline**
- [ ] A CRM: HubSpot free CRM, or Attio's free tier. Track leads, conversations, trials and pilots with stages (see `outbound.md`)
- [ ] An email tool for the newsletter and trial emails: Resend (on the radar for product email) or Loops (free tier). Link the existing "Get updates" list (`waitlist` table)
- [ ] Calendar booking link (Cal.com free, or Google Calendar appointment slots) for "book a 20-minute walkthrough"

**Presence**
- [ ] LinkedIn company page: logo, banner, a one-line tagline in customer words, website link, "Software Development" or "Travel Arrangements" industry, and the founder listed as working there
- [ ] Free listings: G2, Capterra (covers GetApp and Software Advice), Product Hunt profile (for later), Crunchbase. Use the same name, one-liner and description everywhere (see `geo.md`)
- [ ] Google Business Profile: optional for SaaS; skip unless there's a real office address
- [ ] Brand basics: logo files (SVG/PNG), 1200×630 social image, a short boilerplate paragraph, and 3 product screenshots with realistic, non-customer data

## Readiness review

When the founder says the gates are met, run through this file with them, mark the status, and then move to `gtm-launch.md` Phase 1.
