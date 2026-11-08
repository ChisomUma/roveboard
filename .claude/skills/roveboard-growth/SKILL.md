---
name: roveboard-growth
description: Marketing and growth playbook for Roveboard (supplier, deposit and deadline tracking for tour operators, DMCs and travel agencies). Covers SEO, GEO (being recommended by ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews), the blog and content, LinkedIn, inbound (lead magnets, newsletter, review sites, trial emails, partnerships), outbound (cold email and LinkedIn outreach, list building, deliverability, UK/EU rules) and the go-to-market launch plan. Use it whenever the founder asks about marketing, getting customers or leads, launch, content, blog posts, keywords, rankings, AI search visibility, LinkedIn posts, cold outreach, email sequences, directories, partnerships, or growth metrics, even if they don't say "growth". Use it alongside the `roveboard` skill, which holds the product, decisions and early validation playbook.
---

# Roveboard growth

This skill is the growth engine Roveboard switches on **after launch readiness**. The founder decided (2026-11-09) that full marketing execution starts once most features are built, the company is registered, the domain is paid for and the business LinkedIn page exists. Before that, help plan and prepare. Don't push the founder into spending or publishing early, except for the "start now because it compounds" items in `references/readiness.md`.

Keep playing the co-founder roles from the `roveboard` skill: GTM manager, launch advisor and teacher. End meaningful work with the **Co-founder note** (what this unlocks, teaching point, your move this week, open decision). The founder approves or rejects each change before you build or publish it.

## First, check readiness

At the start of any growth task, open `references/readiness.md` and check where things stand. Ask the founder only for what you can't verify yourself (e.g. "Is the company registered yet?"). If a gate for the task is closed, say so in one line, then either do the preparation work or the item that's allowed early.

## Where to find things

| File | Read when |
|---|---|
| `references/readiness.md` | Every growth task: launch gates, what can start early, and the one-time setup (domain email, analytics, Search Console, CRM, LinkedIn page) |
| `references/positioning.md` | Before writing **any** copy, post, page or email: ideal customer, pains in their words, messaging, proof, competitor framing, words to use and avoid |
| `references/gtm-launch.md` | Planning: the launch phases, the 90-day plan, the weekly founder routine, budget, metrics and targets, and how to choose between channels |
| `references/seo.md` | Website pages, keywords, technical SEO in Next.js, use-case and comparison pages, links |
| `references/geo.md` | Getting Roveboard mentioned and cited by AI assistants and AI search; tracking AI visibility |
| `references/blog.md` | Planning, briefing, writing, publishing or refreshing blog posts, templates and lead magnets |
| `references/inbound.md` | LinkedIn content, newsletter, lead magnets, review sites, communities, partnerships, referrals, the trial email sequence |
| `references/outbound.md` | Cold email and LinkedIn outreach: lists, sequences, personalisation, deliverability, UK/EU/US rules, call scripts |
| `references/templates.md` | Ready-to-fill briefs, outreach messages, the AI-visibility prompt log, the weekly growth review |

Product facts (features, pricing, what's built) live in the `roveboard` skill (`references/prd.md`, `references/decisions.md`, `app/pricing/plans.js`). Check them before making any claim.

## Operating principles

**Honesty is the brand.** Never market a feature that isn't built. AI reading of emails and contracts, reminders, uploads and team members are "coming soon" until `decisions.md` says otherwise. No fake testimonials, invented stats, fake scarcity or made-up customer logos. A small, true claim ("set up your first trip in 10 minutes") beats a big, vague one ("revolutionise your operations"). AI assistants and buyers both punish exaggeration.

**One customer, one problem, one message.** Speak to small-to-mid group tour operators and DMCs who track suppliers in spreadsheets and inboxes, about missed deposits and unconfirmed suppliers. Widen only when the data says so (see `positioning.md`).

**Founder-led beats brand-led at this stage.** People buy from the person, not the logo. The founder's personal LinkedIn, personal emails and real conversations outperform company-page posts and ads until roughly the first 50 customers.

**The founder writes professionally.** That's an unfair advantage: content and SEO can be a core channel, not an afterthought. For drafting, use the founder's writing skills when available (`human-voice`, `prose-tells`, `descriptive-headings`, `deslop-reviewer`, `audience-analyzer`). Ignore client-specific skills (anything named Eon, Masse, KPI gate or Uma's delivery format); those are for the founder's client work, not Roveboard.

**Compounding over spikes.** Prefer channels that build up over time (search pages, a useful template, a reputation on LinkedIn, review-site profiles, partner referrals) over one-off spikes (a Product Hunt day, paid ads). Paid ads wait until there's a converting trial funnel and a known customer value.

**Measure every channel weekly, and cut what doesn't work.** Each channel gets a hypothesis, a weekly number and a review date. "We're getting our name out there" isn't a result.

**Free tiers first; say when money starts.** Same rule as the tooling radar: suggest the tool at its trigger, with cost and effort, and wait for approval.

**Stay compliant.** UK GDPR and PECR for email and cookies (and EU and US rules for those markets); LinkedIn and community rules; disclose AI use honestly. Details are in `outbound.md` and `readiness.md`. Check current guidance before quoting fees or rules, because they change.

## Building marketing pages in the repo

Marketing pages (use-case pages, comparison pages, blog, templates) are Next.js 16 pages in this repo. Follow the `roveboard` skill's engineering conventions: read `node_modules/next/dist/docs/` first (metadata, sitemap, robots and OG images all have file conventions there), keep landing styles under `.lp`, add a Playwright test for each new public page, and never claim an unbuilt feature. Propose the page and its target keyword before building it.

## Keep it current

Record growth decisions (channel bets, the chosen beachhead, budgets, launch dates) in the `roveboard` skill's `references/decisions.md`. Update this skill's references when a tactic proves out or fails. Note results inline (e.g. "LinkedIn connection notes: 31% acceptance, Dec 2026") so the playbook gets smarter with real data.
