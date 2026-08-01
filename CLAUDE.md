# CyberUnit @ UNG — working notes

Interactive cybersecurity education site on **Cloudflare Workers + D1**. The
only entry point is **`worker.js`** (routing, API, auth, security headers,
per-page SEO injection). There is no bundler/build step — `npx wrangler dev`
runs `worker.js` directly against `./public`.

*(An earlier `server.js` Express prototype — static topic pages only, no
auth/D1/Quiz Rooms — was removed on 2026-07-30 once it no longer reflected
the app in any meaningful way. If you see references to it in old commits or
docs, it's gone; don't recreate it.)*

## Deployment
- **Pushing to `main` auto-deploys** via GitHub Actions (`wrangler deploy`). There is
  no separate deploy step — a push *is* a deploy.
- **Schema changes must be migrated on the remote D1 *before* the deploy lands**, or
  the worker will query a column/table that doesn't exist in prod and error. Apply to
  both local and remote:
  - `npx wrangler d1 execute DB --local  --command "<ALTER/CREATE ...>"`
  - `npx wrangler d1 execute DB --remote --command "<ALTER/CREATE ...>"`

## Gotchas when adding things

**Adding a new HTML page (`public/*.html`):**
- Cloudflare serves matching static files *before* the worker, so they bypass the
  worker's security headers (CSP, `X-Frame-Options`, `nosniff`). **Add the page's
  route to `run_worker_first` in `wrangler.toml`** so it gets those headers. Do NOT
  add CSS/JS/image paths there — routing assets through the worker breaks their MIME
  type. Pages only.
- **Never write inline `<script>` blocks.** The CSP `script-src` is `'self'` only (no
  hash/nonce/unsafe-inline), so inline scripts are blocked. Put all JS in a
  `public/js/*.js` file and load it with `<script src="/js/…">` — same-origin scripts
  are allowed automatically and need no CSP changes ever.
- If the page needs `main.js`, load it as `<script type="module" src="/js/main.js">`
  (not a classic script) — `main.js` imports `public/js/topic-render.js`, which needs
  module semantics. `about.js`/`start.js` stay classic scripts; they don't import
  anything.
- If it should rank in search: **add its path to the sitemap** (the `paths` array in
  the `/sitemap.xml` route in `worker.js`) and give it a unique `<title>` +
  `<meta name="description">`.
- If it's a private/app page (auth-gated): add `<meta name="robots" content="noindex">`
  and do NOT list it in the sitemap.

**Adding a topic:** add it to the `topics` array in `worker.js`. The sitemap, the
per-topic `<title>`/description/OG/`BreadcrumbList`, and the homepage grid all derive
from that array automatically. Two things that do NOT auto-update:
- **The Beginner Pathway** (`/start`): a new topic won't appear until you add its id to a
  stage's `topicIds` in the `pathwayStages` array.
- **Topic hook/takeaway**: add an entry in the `topicFraming` map (keyed by topic id) so
  the topic page gets its mentor intro + key takeaway.

**Homepage topic grid** and the **`/start` pathway** are server-rendered by the worker
(`homeTopicCards()` on `path === '/'`, `pathwayHtml()` on `path === '/start'`) so crawlers
see the content without JS. `main.js`/`start.js` then enhance with per-user progress and
leave the server-rendered cards intact if that fetch fails. Both share the `topicCard()`
"module" component (worker-only — the client re-fetches via `/api/topics` rather than
needing its own copy). **`/topic/:id` lesson content is also server-rendered**, via
`renderContent()` + its 16 `render*` helpers + `getTopicSVG()` — these live in
`public/js/topic-render.js`, a small dependency-free ES module with no DOM/browser API
calls, imported by both `worker.js` (server render, for crawlers/no-JS) and
`public/js/main.js` (client render, adds per-user progress). One source of truth — no
more hand-syncing two copies. (This split is *why* `public/js/main.js`'s `<script>` tag
needs `type="module"`: see the `<head>` of any `public/*.html` page.)

**Public/private profiles:** `users.is_public` (default `0`, opt-in) gates `/u/:username`.
`GET /api/user/:username` is the only place that subset is ever returned — it must stay a
strict field whitelist (username, avatar, member-since, pathway badges, module/room rank,
isStudent, isUngStudent) and must **never** include quiz-room history, per-topic quiz
progress, role, id, the verified email address itself, or any other field from
`/api/profile`. Unknown username or a guest account → `404`; a real but private account →
`403` (no data). The leaderboard links every username to `/u/:username` regardless of
visibility — the private/404 state is resolved when that page is opened, not by hiding the
link.

**Student role & email verification:** `users.role` can be `'student'` (ranked above
`member`, below `instructor` in `ROLE_RANK`) once a member verifies any `*.edu` address via
`/api/auth/verify-email/request` + `/api/auth/verify-email/confirm` (worker.js). `*@ung.edu`
additionally sets `users.is_ung_student`. Role lives in the session JWT, not re-checked
against the DB per request — `refreshRoleIfStale()` in worker.js reissues the cookie from
`/api/auth/me` and `/api/profile` (both already polled on every page load) whenever the DB
role has moved past the cookie's, so a verified user doesn't have to log out/in to unlock
student-gated content (Quiz Rooms with `visibility='student'`, `/student-hub`). Verification
emails send via the Resend HTTP API (`sendResendEmail()` in worker.js, plain `fetch()`, no
binding) rather than Cloudflare's own Email Sending — that's a paid product; Resend's free
tier covers this app's volume. Needs the `RESEND_API_KEY` secret set (`wrangler secret put
RESEND_API_KEY`) and `ungcyberunit.org` verified with Resend, or `/api/auth/verify-email/request`
silently skips sending (the `if (env.RESEND_API_KEY)` guard) so local dev without the secret
still works.

## Verify before committing
Run `npx wrangler dev` and actually exercise the change (repo pattern: drive it in
headless Chrome via puppeteer-core). For DB-touching work, seed and clean rows with
`wrangler d1 execute DB --local`, and delete any test users/rows afterward.
