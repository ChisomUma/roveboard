# Blog, content and lead magnets

The blog exists to **bring in operators with the exact problem and turn them into trials**, and to give AI assistants clear, citable answers. It's not a news feed. Quality and usefulness beat volume.

## Cadence (sustainable for a solo founder)

- **Launch with 4–6 strong pieces**, not one: the lead-magnet template page, 2 problem/how-to guides, the spreadsheet comparison, and 1 insight piece from interviews.
- Then **2 posts a month**, plus one refresh of an older post a month. Each post gets repurposed into 3–5 LinkedIn posts (see `inbound.md`).
- Raise the cadence only if posts are getting indexed, ranking and converting.

## Content pillars

1. **Supplier coordination** (core): confirmations, chasing replies, supplier directories, rooming lists, changes to group size.
2. **Payments and deadlines**: deposits, balances, release dates, cancellation terms, cash flow across trips.
3. **Running group trips**: planning timelines, costing a group tour, working with DMCs, risk and contingencies.
4. **Running a small tour business**: season planning, scaling the team beyond one person's memory, choosing software, spreadsheets vs tools.
5. **Original insight**: what operators told us (anonymised), survey results, real (anonymised and permissioned) trip examples.

## First posts and assets (draft plan, the founder approves)

| # | Working title | Type | Target search/intent |
|---|---|---|---|
| 1 | Free group trip supplier and deposit tracker (Google Sheets and Excel) | Lead magnet page | "group tour supplier tracking spreadsheet", "deposit tracker template" |
| 2 | How to track supplier deposits and balances for group tours | How-to guide | "track supplier deposits group travel" |
| 3 | The supplier deadlines that sink group trips (and how to never miss one) | Problem guide | "hotel group booking deadlines", "release date group contract" |
| 4 | Spreadsheet vs supplier tracking software for tour operators: an honest comparison | Comparison | "spreadsheet vs software tour operator" |
| 5 | What happens when a group grows from 20 to 24: a supplier checklist | Checklist | "group size change checklist hotel coach" |
| 6 | We asked UK tour operators how they track suppliers. Here's what we learned | Original insight | Authority, links, LinkedIn shares (only with real interview data) |

## The lead magnet: "Group trip supplier and deposit tracker"

- A genuinely useful Google Sheet/Excel template: one tab per trip, supplier rows with category, contact, confirmation status, deposit amount/due/paid, balance amount/due/paid, notes; a summary tab with totals owed and the next 10 deadlines (formulas).
- **Its columns match Roveboard's import template**, so "When the spreadsheet gets painful, import it into Roveboard in one click" is a natural, honest upgrade path. Test the round trip with the real import before publishing.
- Offer it **ungated** (a direct download, good for SEO and AI citations) with an optional "email me the template plus tips" form for the newsletter. Gating it behind an email cuts downloads and links; for a new brand, reach matters more.
- Use UTM-tagged links to track downloads → sign-ups.

## Writing a post (the workflow)

1. **Brief first** (template in `templates.md`): target reader, search intent, primary question, what the reader should be able to do afterwards, unique angle (interview insight, real example, data), internal links, CTA. The founder approves the brief.
2. **Research:** what's ranking now and what it misses; questions from "People also ask" and interviews; verify every fact and figure (link primary sources; no invented stats).
3. **Draft for the coordinator, not for Google:** answer the main question in the first 2–3 sentences; descriptive H2/H3s that work as standalone answers; steps, tables and checklists where they help; a realistic example (Sunshine Travel / Italy Explorer from the PRD, clearly fictional); UK English; short paragraphs.
4. **Use the founder's writing skills when available:** `descriptive-headings` (scannable H2s), `human-voice` and `prose-tells` (remove AI tells), `deslop-reviewer`, `audience-analyzer`. Don't apply the Eon/Masse/KPI-gate/delivery-format skills; they're for client work.
5. **Honesty pass:** no unbuilt features presented as available; product mentions only where they genuinely help (usually once in the body, once in the closing CTA); competitors described fairly with dates.
6. **SEO pass:** title and meta description, slug (short, keyword-based), alt text, internal links (2+ out, 1+ in), `Article` schema with the founder as author, "last updated" date.
7. **Publish and distribute** (see `inbound.md`): LinkedIn posts, newsletter, relevant community answers (only where it truly answers the question), send to interviewees who raised that problem.

## E-E-A-T (why Google and AI assistants should trust the post)

Experience, expertise, authority, trust. Show **experience**: real operator quotes (with permission), real screenshots, real (anonymised) numbers. Have an **author page** for the founder with a real bio and LinkedIn link. Cite primary sources. Correct mistakes visibly.

## Building the blog in the repo (propose before building)

Recommended: MDX posts in the repo (`app/blog/` with `@next/mdx`, or plain JS content files), rendered as static pages. No CMS until there's a second writer. Each post exports its metadata (title, description, date, updated, author, keyword). An index page and RSS feed, the sitemap includes posts, and the `Article` JSON-LD is generated from the metadata. Check the Next.js 16 MDX guide in `node_modules/next/dist/docs/` first. Add a Playwright test that every post renders and has a title, description and canonical.

## Refresh and prune (monthly)

Use Search Console: posts with impressions but low clicks get a better title and description; posts on page 2 get expanded with missing sub-questions; posts with no impressions after 6 months get merged into a stronger page (with a 301 redirect) or removed. Update facts, prices and screenshots, and change "last updated" only when the content really changed.
