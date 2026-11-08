# SEO (search engine optimisation)

Goal: when a tour operator searches for a way to track suppliers, deposits or deadlines, Roveboard (or a Roveboard page that genuinely helps) shows up. In a small B2B niche, a few hundred well-targeted visitors a month can be worth more than 50,000 random ones.

**Reality check for the founder:** SEO takes 3–9 months to show results on a new domain. That's why the technical foundations and the first pages should go live as soon as the domain does. Don't judge the channel before month 4.

## 1. Technical foundations (build once, with the real domain)

Next.js 16 has file conventions for all of this. Read the docs in `node_modules/next/dist/docs/01-app/` (search for metadata, sitemap, robots, opengraph-image, generateMetadata) before building.
- **Metadata on every public page:** a unique `title` (50–60 characters, keyword first, then "| Roveboard"), a `description` (140–160 characters, a benefit plus a call to action), a canonical URL, and Open Graph/Twitter tags.
- **`app/sitemap.js`**: all public pages (landing, pricing, use-case pages, comparisons, blog posts, templates, legal), never workspace or auth pages.
- **`app/robots.js`**: allow public pages; disallow `/trips`, `/deadlines`, `/suppliers`, `/notes`, `/dashboard`, `/onboarding`, `/login`, `/auth`, `/api`; link the sitemap. AI crawler choices are in `geo.md`.
- **Structured data (JSON-LD):** `Organization` (name, logo, url, sameAs: LinkedIn and directory profiles) on the home page; `SoftwareApplication` (applicationCategory BusinessApplication, offers from `plans.js`; add `aggregateRating` only with real reviews); `FAQPage` markup only where the FAQ is visible on the page; `Article` (author = the founder, with a real author page) on blog posts; `BreadcrumbList` on nested pages. Validate with Google's Rich Results Test.
- **Speed and Core Web Vitals:** server-rendered pages, `next/image` with sizes, `next/font`, and no heavy client JS on marketing pages. Check PageSpeed Insights (target 90+ on mobile).
- **One domain, one version:** HTTPS, a single host (`www` or apex) with 301 redirects, no `roveboard.vercel.app` duplicates indexed (redirect, or `noindex` on the Vercel host).
- **Internal links:** every new page links to at least 2 related pages and the sign-up, and gets linked from at least one existing page. No orphan pages.
- **Tests:** add a Playwright check per public page (status 200, title, canonical, no `noindex`), per the repo's testing rule.

## 2. Keyword strategy: bottom of the funnel first

A new domain can't win broad terms ("tour operator software") for a long time. Win specific, high-intent searches where the searcher has the exact problem, then widen.

**Priority order:**
1. **Problem and solution searches (highest intent):** "supplier management for tour operators", "track supplier deposits group travel", "DMC supplier confirmation tracking", "group tour payment deadline tracker".
2. **Template searches (high volume, very qualified):** "group tour supplier tracking spreadsheet", "tour operator deposit tracker template", "group travel budget template", "supplier contact list template travel". Answer with a genuinely good free template (see `blog.md`).
3. **Alternative and comparison searches:** "spreadsheet vs software for tour operators", "<competitor> alternative for small operators", "Tourplan vs <x>" (fair, dated comparisons only).
4. **How-to and education (top of funnel, builds authority):** "how to manage suppliers for group tours", "deposit vs final balance payment terms hotels group booking", "how to negotiate group rates with hotels", "release dates in hotel group contracts", "how to start a tour company UK" (careful: broad and competitive).

**Research method (free first):** Google autocomplete and "People also ask"; Search Console queries (after launch); AnswerThePublic (limited free tier); Ahrefs' free keyword generator and Webmaster Tools (free for your own site); questions from interviews, LinkedIn comments, Reddit (r/travelagents, r/TourGuides) and Facebook operator groups. Paid tools (Ahrefs, Semrush, ~$100+/mo) only once content is a proven channel.

**Pick keywords by:** intent (would this person buy?) > winnability (are the top results forums, thin listicles or old posts? Then you can win) > volume. Small volumes are fine; "10 searches a month" can mean 10 operators with the exact problem.

**One page per intent.** Don't make several posts that target the same query; they compete with each other. Keep a keyword → URL map in the content plan (see `templates.md`).

## 3. Page types to build (in order)

1. **Home page:** the one-liner, the problem, pillars, proof, CTA. Target the core term ("supplier tracking for tour operators").
2. **Pricing:** exists. Make sure the plain prices are in the HTML text (good for search and AI answers).
3. **Use-case pages, one per segment:** `/for/tour-operators`, `/for/dmcs`, then `/for/school-trips`, `/for/incentive-travel` as segments are tested. Each has a different pain, example trip and supplier types. Not copy-paste with the noun swapped: Google and AI assistants ignore near-duplicates.
4. **Feature pages, only for built features:** `/features/deposit-tracking`, `/features/supplier-directory`, `/features/spreadsheet-import`, `/features/export`.
5. **Free templates:** `/templates/group-trip-supplier-tracker` (lead magnet with a download plus "import it into Roveboard").
6. **Comparison pages:** `/compare/spreadsheet` first (the real competitor), then competitor pages after research, fair and dated.
7. **Blog:** see `blog.md`.
8. **Glossary (later):** short, accurate definitions of travel-trade terms (release date, allotment, attrition, rooming list, pro forma, DMC, FIT vs group). Low competition, useful for AI answers, and good for internal links.

**Programmatic SEO** (hundreds of generated pages, e.g. "supplier tracker for tours to <every city>"): don't. Thin generated pages are against Google's spam policies (scaled content abuse) and hurt the whole domain. A small number of genuinely different pages wins.

## 4. Links and authority (for a tiny B2B brand)

Good links come from being useful and present in the travel trade, not from buying them (paid links break Google's rules).
- Partner and association listings: AITO, ETOA or ABTA supplier/partner directories if eligible; travel-tech directories; startup directories (Crunchbase, Product Hunt, BetaList).
- Review sites: G2 and Capterra profiles (also feed AI assistants; see `geo.md`).
- Guest posts and expert quotes in travel-trade media (TTG, Travel Weekly, Travolution, PhocusWire, Skift) and operator newsletters. Pitch a useful angle from your interview insights, e.g. "What 20 operators told us about missed supplier deadlines".
- Journalist request services (Qwoted, Featured, the successor services to HARO) for travel-business quotes.
- Integration and partner pages once integrations exist (Xero, Travefy, etc. per "integrate, don't build").
- Original data people cite: a yearly "State of supplier coordination in small tour operators" survey (anonymised, real numbers only).

## 5. Measure (monthly)

Search Console: impressions, clicks, average position per page and query; pages indexed vs submitted. Analytics: organic visitors → sign-ups (and which pages convert). Targets for a new domain: indexed pages = published pages by month 2; first page-1 positions on long-tail terms by months 3–5; organic sign-ups measurable by month 6. Refresh or merge pages that get impressions but no clicks (rewrite the title and description) or clicks but no sign-ups (fix the page's CTA and relevance).
