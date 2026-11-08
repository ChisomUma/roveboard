# GEO (generative engine optimisation)

Goal: when someone asks an AI assistant "what's a good tool for tracking supplier deposits for my tour company?", Roveboard is named, described correctly and linked. That applies to ChatGPT, Claude, Perplexity, Gemini, Copilot and Google's AI Overviews and AI Mode.

**Honest caveat for the founder:** GEO is young, and evidence about what works is still thin. Vendors sell certainty they don't have. The tactics below are the ones with a clear mechanism, and most of them are also good SEO and good marketing. Don't pay for "GEO hacks".

## How AI assistants decide what to say

1. **Live search (retrieval):** most assistants search the web (their own index, Bing or Google) and summarise what they find, citing sources. So you need to **rank in classic search** and have pages that are **easy to quote**.
2. **Training data:** what the model learned about you from the web before its cutoff. Built slowly from **consistent mentions across many independent sites**.
3. **Entity understanding:** whether the model knows "Roveboard" is a software product for tour operators (not a skateboard shop). Built by **consistent naming and descriptions** everywhere, plus structured data.

Assistants favour sources that are **specific, factual, recent, consistent with other sources and from third parties**, not just your own site.

## Tactics, in priority order

### 1. Be the clearest answer on your own site
- Pages that answer one question each, plainly, near the top: "Roveboard is …", "Roveboard costs £29–£149 a month on yearly billing, with a 20-day free trial", "Roveboard works for tour operators, DMCs and travel agencies running group trips".
- Facts in **HTML text**, not only in images or client-side JavaScript. Prices, limits, features, "who it's for" and "who it's not for".
- Short definitions, numbered steps, comparison tables, FAQs with direct one-or-two-sentence answers, then detail. These formats get quoted.
- State limitations honestly ("Roveboard doesn't process payments or book suppliers"). It builds trust, and it stops assistants recommending you for the wrong job (which creates churn).
- Keep "coming soon" features clearly labelled, so assistants don't tell people the AI already exists.

### 2. Get mentioned on other sites (most important long term)
- **Review sites:** G2, Capterra, GetApp, Software Advice. Ask every happy pilot and customer for an honest review (never pay for or write reviews).
- **"Best X" lists and roundups:** pitch inclusion in "best software for tour operators / DMCs" articles on travel-trade blogs and SaaS review sites. Assistants lean heavily on listicles.
- **Communities:** genuine, helpful participation on Reddit (r/travelagents, r/smallbusiness), Quora, LinkedIn and Facebook operator groups. Disclose that you're the founder; no astroturfing (it gets found and punished by both communities and platforms).
- **Trade media, podcasts, association newsletters, partner pages.** Each independent mention that says "Roveboard, a supplier tracking tool for tour operators" teaches the models what you are.

### 3. Make the entity unambiguous
- The **same name, one-liner and boilerplate** (from `positioning.md`) on the site, LinkedIn, Crunchbase, G2, Capterra, Product Hunt, GitHub org (if public) and press mentions.
- `Organization` and `SoftwareApplication` JSON-LD with `sameAs` links to every official profile (see `seo.md`).
- An **About page** with the founder's real name, the company's legal name and location, and the founding story. Assistants (and buyers) trust products with a visible person behind them.
- Consider a Wikidata item only once there's independent coverage to cite; don't create a Wikipedia page for yourself (against their rules).

### 4. Let the right crawlers in (`app/robots.js`)
Decide this deliberately with the founder (record it in `decisions.md`). Recommended: **allow** search and answer crawlers on public marketing pages, so assistants can cite you:
- OpenAI: `OAI-SearchBot` (ChatGPT search), `ChatGPT-User` (fetching pages for a user), `GPTBot` (training)
- Anthropic: `Claude-SearchBot`, `Claude-User`, `ClaudeBot` (training)
- Perplexity: `PerplexityBot`, `Perplexity-User`
- Google: `Googlebot` covers Search and AI Overviews; `Google-Extended` controls only use for Gemini training
- Microsoft: `Bingbot` (also feeds Copilot and others)

For a marketing site, allowing training crawlers is usually in Roveboard's interest (more model knowledge of the product). **Always block all crawlers from app routes** (`/trips` etc.). Customer data is behind login anyway, but keep robots clean. Check each vendor's current crawler names before shipping; they change.

### 5. `llms.txt` (optional, low cost, low evidence)
A plain-text `/llms.txt` summarising the product and linking key pages. Major assistants haven't confirmed they use it. It takes 20 minutes to build, so add it when building the SEO foundations, but don't count on it.

### 6. Freshness
Put "Last updated <date>" on pricing, comparisons and key guides, and really update them. Assistants prefer recent sources for anything about prices and tools.

## Measuring AI visibility (monthly, 30 minutes)

1. **Prompt log:** keep the 20 prompts in `templates.md` (the questions a real operator would ask). Once a month, ask each one in ChatGPT, Claude, Perplexity, Gemini and Google (AI Overview/AI Mode), in a logged-out or fresh session. Record whether Roveboard is mentioned, whether it's described correctly, which competitors appear, and which sources were cited.
2. **Referral traffic:** in analytics, track visits from `chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`. Small numbers convert well; watch the sign-up rate.
3. **"How did you hear about us?"**: the sign-up question has "Google search" and "Other". Consider adding "AI assistant (ChatGPT, Claude…)" as an option once it's plausible. This needs a migration (the database check lists the allowed answers), so propose it first.
4. **The sources that get cited** are your target list. If assistants keep citing a particular roundup or forum thread, get included there honestly.

Paid AI-visibility trackers (Profound, Otterly, Peec and similar) only once the manual log shows movement and the budget allows it.
