# Tooling radar

Third-party tools that make Roveboard production-ready and world-class, with **when** each one earns its place. As technical co-founder, suggest the relevant tool proactively when its trigger is reached (or about to be), with the business reason, the cost, and the effort. Then wait for the founder's approval (see "Propose, then wait for approval" in SKILL.md).

**Principles**
- **Free tiers first.** The founder is a solo bootstrapper. Prefer tools with a genuine free tier, and say plainly when something will start costing money and roughly how much. Check current pricing before quoting numbers; free tiers change.
- **Adopt on a trigger, not on hype.** Each tool solves a problem we have, or are about to have. Premature infrastructure is a cost (money, complexity, things to break).
- **Everything in the founder's name.** Accounts are created under the founder's email; secrets go in `.env.local` or Vercel env vars, never in the repo or chat.
- **Prefer what we already have.** Supabase (Postgres, Auth, Storage, Realtime, cron, Edge Functions) and Vercel cover a lot before a new vendor is needed.
- Update this file when a tool is adopted (move it to "In use") or a trigger changes.

## In use

| Tool | What for | Notes |
|---|---|---|
| **Next.js 16** (Vercel) | Website and app | Read `node_modules/next/dist/docs/` before coding (`AGENTS.md`) |
| **Vercel** (Hobby) | Hosting, auto-deploys from GitHub | Hobby is non-commercial. Move to Pro (~$20/mo) once customers pay |
| **Supabase** (Free) | Postgres, Auth (email/password; Google pending), RLS | Free projects pause after 1 week of inactivity; Pro is from $25/mo. Check backup options before relying on it for paying customers |
| **GitHub** | Code and version history | Repo `ChisomUma/roveboard`; recommend keeping it private |
| **Unsplash** | Photos | Credits in `IMAGE-CREDITS.md` |
| **CSV export** (built in, `app/(workspace)/export.js`) | "Your data is yours": all trips (Trips page) or one trip (trip page) to a spreadsheet; columns match the import template so exports re-import | Built 2026-11-08; CSV-injection-safe, UTF-8 BOM for Excel |

## Next (adopt during the private pilot)

| Tool | What for | Trigger | Cost |
|---|---|---|---|
| **Sentry** | Error monitoring: get told when something breaks for a user, with the details | Before the first pilot company uses it | Free developer tier |
| **PostHog** | Product analytics (sign-up funnel, which features get used), session replay, feature flags | As soon as real sign-ups arrive | Generous free tier |
| **Playwright + GitHub Actions** | End-to-end tests kept in the repo and run on every push | Now: our click-test scripts lived in a temp folder and were lost twice | Free for public repos; free minutes for private |
| **Supabase Storage** | Contracts and supplier photos in the cloud (re-enables uploads) | Next feature, per roadmap | Included (1 GB free) |
| **Resend** (+ React Email) | Login and confirmation emails (custom SMTP), deadline reminders | Before switching "Confirm email" back on; before reminders | Free tier; needs a domain (~£10/yr) |
| **Domain** (Cloudflare Registrar or Namecheap) | roveboard.co or similar; needed for proper email | Before public launch or email sending | ~£10–15/yr |
| **Cloudflare Turnstile** | Free CAPTCHA on sign-up, so bots don't create accounts (Supabase supports it) | When sign-ups are public and spam appears, or before launch | Free |
| **Google OAuth** (Google Cloud) | "Sign in with Google" | Founder asked for it; pending setup | Free |
| **Dependabot** (GitHub) | Automatic pull requests for security updates to packages | Now, a one-time switch | Free |
| **UptimeRobot / Better Stack** | Alert if the site goes down; optional status page | Before the pilot | Free tiers |
| **Bitwarden** (for the founder) | Password manager for all these accounts and secrets | Now | Free |

## Later (when the trigger hits)

| Tool | What for | Trigger |
|---|---|---|
| **Anthropic Claude API** | AI reading of supplier emails and contracts (native PDF support) | Building the AI feature. Load the `claude-api` skill first |
| **Upstash Redis** (+ `@upstash/ratelimit`) | Rate limiting AI calls per user (cost protection); caching | With the AI feature, or when abuse or slow pages appear |
| **Vercel Cron / Supabase pg_cron + Edge Functions** | Scheduled jobs, e.g. daily reminder emails | Building reminders |
| **Inngest or Trigger.dev** | Reliable multi-step background workflows (retries, schedules) | Inbox syncing, or long AI jobs |
| **Paddle** (chosen 2026-11-08) | Subscriptions as merchant of record (handles VAT/sales tax), checkout, customer portal, webhooks | Billing phase 2: the founder creates Paddle sandbox + live accounts. Fee ~5% + 50¢ per transaction (check current pricing). Requires a refund policy page and business verification |
| **Loops / Resend Audiences / Kit** | Emailing the "product updates" list | When the founder starts sending updates |
| **Crisp** (free) → Intercom later | In-app chat and support | The pilot; customers will have questions |
| **Supabase Realtime** | Live updates when teammates edit the same trip | Team collaboration feature |
| **Xero / QuickBooks APIs** | Sync supplier payments to accounting | Customers ask (per the "integrate, don't build" decision) |
| **Travefy / Tourwriter integrations** | Send confirmed supplier details to itineraries | Operators commonly use them (track in interviews) |
| **Zapier / Make** app | No-code connections to 1,000+ apps (e.g. "deposit marked paid → Google Sheets/Slack") without a full public API | Several customers ask for "Roveboard + X" |
| **Public REST API + webhooks** (versioned, API keys, docs, Upstash rate limiting) | Larger operators connect their own reservation systems; offer it as a Business/Enterprise feature | Business or Enterprise prospects need it to buy, or partners want to build on Roveboard. Not before: an API is a product to maintain. Don't expose Supabase's internal REST as the public API |
| **Nylas** (or the Gmail/Microsoft Graph APIs) | Connected inboxes | Later-stage feature; paid |
| **TypeScript + ESLint + Prettier** | Fewer bugs as the codebase and team grow | Before hiring a second developer, or once the codebase gets larger |
| **Postgres full-text search → Typesense/Algolia** | Search across trips and suppliers | Search becomes slow or important |

## Deliberately not needed yet

Kubernetes, Docker, microservices, a separate backend server, self-hosted Redis, or a data warehouse. Vercel and Supabase cover pilot and early-customer scale. Adding these now would cost time and money without helping customers.
