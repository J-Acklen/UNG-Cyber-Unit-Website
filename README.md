## [https://ungcyberunit.org/](https://ungcyberunit.org/)

# CyberUnit @ UNG

An interactive cybersecurity education website for the **University of North Georgia Boar's Head Brigade Cyber Unit**.

Covers beginner cybersecurity topics with quizzes, an about page with the unit's org structure and sister organization (CyberHawks), an SOP link, user accounts with progress tracking, and instructor-hosted live Quiz Rooms with public/private visibility and free-response grading.

Built with **Cloudflare Workers**, **D1**, and vanilla HTML/CSS/JS.

---

## Topics Covered

| # | Topic |
|---|-------|
| 01 | What is Cybersecurity? (CIA Triad) |
| 02 | Types of Threats |
| 03 | Passwords & Authentication |
| 04 | Phishing & Social Engineering |
| 05 | Networking Basics for Security |
| 06 | Encryption Basics |
| 07 | Safe Browsing & Digital Hygiene |
| 08 | Linux & Command Line Basics |
| 09 | Incident Response Basics |
| 10 | Careers in Cybersecurity |
| 11 | Bash Basics for Kali Linux |

Each topic includes reading content and a 3-question quiz with instant feedback.

### Beginner Cyber Pathway

`/start` is a guided, mentor-narrated starter path for people brand new to cyber. It
groups the topics into six ordered stages (Start Here → Go Further), shown as a vertical
connected-node path with the shared topic "module" cards. Signed-in learners get a
progress bar, per-stage completion badges, a daily learning streak, "continue where you
left off," and scroll-in motion (respecting `prefers-reduced-motion`). Each topic page
also carries a mentor-voice hook and a plain-English key takeaway.

---

## Quiz Rooms

Instructors can host live quizzes separate from the self-paced topic quizzes above:

- **Question sources** — build questions manually in the Instructor Panel (card-based builder), or import a `.csv`/`.json` file. Both support two question types:
  - **Multiple choice** — 2–4 answers, auto-graded on submit.
  - **Free response** — student types an answer; scored as *pending* until an instructor manually grades it correct/incorrect from the results page. The attempt shows a tentative score in the meantime.
- **Visibility** — a room is **Private** (default, join by code only) or **Public** (also listed for any logged-in member to browse and join on the **Join Room** page, at `/quiz`).
- **Instructor results view** — per-student roster with score, a "N pending" badge when free-response grading is outstanding, a **Review Answers** button (jumps straight to the grading controls, which also show the question's grading notes), a **Reset Attempt** button (lets a student retake the quiz), and CSV export.
- **Room codes** are `XXXX-XXXX`, generated with a CSPRNG.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers |
| Database | Cloudflare D1 (`schema.sql`) |
| Static assets | Cloudflare Workers Assets (`./public`) |
| Frontend | Vanilla HTML / CSS / JS |
| Auth | Custom JWT (HS256) + PBKDF2 password hashing, HttpOnly `SameSite=Strict` session cookie |
| Input validation | Server-side length caps on all Quiz Room fields, 1MB question-file cap, CSV/formula-injection sanitization on exported reports, parameterized SQL throughout |
| Room privacy | Room codes are 32⁸ (~2⁴⁰) CSPRNG values; unknown/closed/expired codes all return an identical 404 (no existence oracle); failed code lookups are rate-limited per IP (20 / 10 min) to block brute-force enumeration |
| Deployment | Wrangler CLI, auto-deployed on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`) |

---

## Project Structure

```
cybersec-basics/
├── public/
│   ├── index.html         # Home / topic grid
│   ├── topic.html         # Individual topic viewer
│   ├── resources.html     # External learning links
│   ├── about.html         # Unit overview and org chart
│   ├── admin.html         # Admin panel (user/role management)
│   ├── instructor.html    # Instructor panel (create/manage Quiz Rooms, grade free responses)
│   ├── quiz.html          # "Join Room" page: browse public rooms + join by code
│   ├── quiz-room.html     # Student: live Quiz Room attempt
│   ├── css/               # Global stylesheet
│   ├── images/            # Topic images
│   └── js/                # Client-side scripts
├── worker.js              # Cloudflare Worker — canonical entry point: routing, API, auth, security headers
├── server.js               # Legacy Express prototype — static topic pages only, no auth/DB/Quiz Rooms; not deployed, kept for optional local preview
├── schema.sql              # D1 schema (users [incl. streak/last_active/is_public], quiz_results, quiz_rooms, quiz_room_questions, quiz_room_attempts, quiz_room_answers, room_lookup_failures)
├── wrangler.toml           # Cloudflare Workers configuration
└── package.json
```

> **Note on `server.js`:** this was the original Express-based prototype and predates the account system, D1 database, and Quiz Rooms feature. It is **not used in production** — `wrangler deploy` runs `worker.js` exclusively. It's kept around only as a lightweight way to preview the static topic pages with `npm start`/`npm run dev`, and does not reflect current functionality (no login, progress tracking, admin/instructor panels, or Quiz Rooms).

---

## Routes

### Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with topic grid |
| `/start` | **Beginner Cyber Pathway** — guided six-stage starter path with progress, badges, and streaks |
| `/topic/:id` | Individual topic with quiz |
| `/resources` | External learning resources |
| `/about` | Unit overview and org chart |
| `/sop` | Cyber Unit SOP (PDF) |
| `/instructor` | Instructor panel — create/manage Quiz Rooms, grade free responses |
| `/quiz` | **Join Room** — browse public Quiz Rooms, or enter a private room code |
| `/quiz/:code` | Student — take a live Quiz Room / view your result |
| `/profile` | Logged-in user's profile — account info + rank, pathway badges, topic progress, Quiz Room history (click your username in the navbar). Includes a public/private visibility toggle. |
| `/leaderboard` | Top Performers leaderboard (member-facing; also a section on the profile). Usernames link to `/u/:username`. |
| `/u/:username` | Public view of a member's profile (username, avatar, member-since, pathway badges, module/room rank) — only if they've opted in via the profile toggle; otherwise shows a "private" state. `noindex`, not in the sitemap. |

### API

| Route | Description |
|-------|-------------|
| `/api/topics` | JSON list of all topics (summary) |
| `/api/topic/:id` | JSON data for a single topic |
| `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` | Account auth |
| `/api/progress` | Logged-in user's per-topic quiz progress |
| `/api/profile` | Logged-in user's account details + Quiz Room attempt history + earned pathway badges + own `isPublic` flag |
| `/api/profile/visibility` (POST) | Logged-in user (non-guest) — toggle whether `/u/:username` is viewable by others |
| `/api/user/:username` | Public subset of a profile (username, avatar, member-since, badges, ranks) if that user has opted in; `403` if private, `404` if unknown/guest |
| `/api/leaderboard?mode=modules\|rooms` | Top performers — by topic-quiz points (`modules`, default) or quiz-room points (`rooms`); guests excluded |
| `/api/admin/users` | Admin — list/manage users |
| `/api/rooms` (POST/GET) | Instructor — create a room / list your rooms |
| `/api/rooms/public` | Any logged-in member — browse open public rooms |
| `/api/rooms/:code/join` | Student — join a room, fetch its questions |
| `/api/rooms/:code/attempt` (POST) | Student — submit answers |
| `/api/rooms/:code/my-attempt` | Student — check your own result |
| `/api/rooms/:code/results` | Instructor — attempt roster for a room |
| `/api/rooms/:code` (GET/PATCH/DELETE) | Instructor — view/edit/delete a room |
| `/api/rooms/:code/attempts/:attemptId` (DELETE) | Instructor — reset a student's attempt |
| `/api/rooms/:code/answers/:answerId` (PATCH) | Instructor — grade a free-response answer |

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm install -g wrangler`)

### Setup

```bash
npm install
```

### Run locally (full app — recommended)

```bash
npx wrangler dev
```

The site will be available at `http://localhost:8787`, backed by D1 and the full auth/Quiz Rooms feature set.

### Run locally (static preview only, via `server.js`)

```bash
npm start        # or: npm run dev (nodemon, auto-reload)
```

Serves only the static topic pages on Express — no auth, no database, no Quiz Rooms. Useful for a quick content-only preview without Wrangler.

---

## Tests

```bash
npm test
```

Runs on Node's built-in test runner (`node --test`, no dependencies) against
`test/worker.test.mjs` — currently 33 suites / 124 assertions. Coverage falls
into three groups:

- **Pure helpers** — `parseCookies`, `hashPassword`/`verifyPassword`, JWT
  sign/verify, `generateRoomCode`, `parseCSV`/`parseCSVLine`,
  `validateJSONQuestions`, `escapeHtml`, `dateStrUTC`, `nextStreak`,
  `pathwayBadges`, and the SEO/rendering helpers (`topicCard`, `pathwayHtml`,
  `topicMetaTags`), all imported directly from `worker.js`.
- **API routes against a mock D1** — a hand-rolled mock (`mockDB()` in the
  test file) records every `.prepare()`/`.bind()`/`.run()`/`.first()`/`.all()`
  call, so a test can assert *exactly* what SQL ran and with what bindings —
  e.g. that `POST /api/profile/visibility` only ever updates
  `WHERE id = session.sub`, or that `GET /api/user/:username` never returns a
  private field. This is the pattern to follow for new endpoints: no real D1
  needed to unit-test authorization/field-whitelist logic.
- **Page-render tests** — hit routes through the real `env.ASSETS` binding
  and assert the returned HTML has no leftover template placeholders (e.g. a
  topic page still showing "Loading topic..."), which is how a previous Soft
  404 regression on `/topic/:id` was caught. Every route in the app is
  exercised this way (see "Static/simple pages", "GET /topic/:id", etc.).

**Tests gate deployment** — `.github/workflows/deploy.yml` runs `npm test`
before `wrangler deploy`; a failing test blocks the push from shipping. When
adding a new pure helper or endpoint, add a matching test in the same style
(see `docs/public-profile-plan.md` for a worked example of this end-to-end,
from migration through tests through deploy verification).

---

## Best Practices

The canonical, continuously-updated version of this lives in
[`CLAUDE.md`](./CLAUDE.md) (read by AI coding assistants working in this
repo, but equally useful for a human contributor). Highlights:

- **CSP is strict** (`script-src 'self'`, no `unsafe-inline`/nonce/hash) —
  never write inline `<script>`; all JS lives in `public/js/*.js` and loads
  via `<script src="/js/…">`.
- **New static pages** (`public/*.html`) must be added to `run_worker_first`
  in `wrangler.toml`, or they bypass the Worker's security headers (CSP,
  `X-Frame-Options`, etc.) entirely. Only pages go there — never CSS/JS/image
  paths, which would break their MIME type.
- **Schema changes must land on remote D1 *before* the deploy that depends on
  them**, applied to both `--local` and `--remote`, or the live Worker will
  query a column that doesn't exist yet and error in production.
- **Server-rendered content is hand-duplicated in two places on purpose** —
  `worker.js` server-renders the homepage grid, `/start` pathway, and
  `/topic/:id` lesson content (for crawlers / no-JS), while `public/js/main.js`
  has the client-side equivalents. Update both when changing a
  topic-rendering helper, or the server-rendered copy silently drifts and
  regresses to a client-JS dependency (this caused a real Search Console Soft
  404 once — see `c205807`).
- **Verify before committing**: run `npx wrangler dev` and actually exercise
  the change — this repo's pattern is driving it in headless Chrome via
  `puppeteer-core` (installed in a scratch dir, not a repo dependency). For
  DB-touching work, seed/clean up rows with `wrangler d1 execute DB --local`.
- **Scroll/paint performance on long pages**: avoid `backdrop-filter` on
  `position: fixed` elements (forces re-sampling everything scrolling
  underneath, every frame). For pages with many repeating hoverable cards,
  the `body.is-scrolling` class (set by `initScrollPerf()` in `main.js`,
  ~150ms after the last scroll event) suppresses hover-triggered transitions
  mid-scroll — reuse it rather than re-inventing per page. For long pages
  (roughly 5 screens+), section-level `content-visibility: auto` +
  `contain-intrinsic-size` (see `resources.html`/`about.html`) lets the
  browser skip layout/paint for off-screen content.

---

## Future-Proofing Notes

Things worth knowing before extending this further:

- **`server.js` is legacy and unused in production** — it predates accounts,
  D1, and Quiz Rooms, and is kept only for a static-content-only local
  preview (`npm start`). It's a reasonable candidate for deletion once no one
  relies on that preview path; don't add features to it.
- **`worker.js` is a single ~180KB file** — routing, API handlers, auth,
  security headers, and SEO/HTML rendering all live in it. There's no build
  step, so this is deliberate (simpler deploy, no bundler), but it means new
  routes should follow the existing `path.match(...)` dispatch pattern rather
  than introducing a router abstraction — consistency matters more than DRY
  here given the file's size.
- **The `worker.js` / `main.js` render-helper duplication** (see Best
  Practices above) is the single biggest source of "worked locally, broke in
  a way only crawlers notice" risk in this codebase. If this grows further,
  consider extracting the shared rendering logic into an isomorphic module
  both sides import, rather than adding a fourth hand-kept copy.
- **CSP allowlist is minimal on purpose** (`connect-src 'self'`, no wildcard
  origins). Any future third-party embed/script/API call needs an explicit,
  reviewed CSP addition in `addSecurityHeaders()` — treat that as a
  deliberate decision point, not a rubber stamp.
- **D1 schema migrations are manual, ordered, two-environment commands** —
  there's no migration framework/history table. As the schema grows, a
  numbered-migration-file convention (even a lightweight one) would reduce
  the risk of local/remote drift; worth revisiting if `schema.sql` keeps
  growing ad hoc.
- **Deploy has a live smoke check** (`.github/workflows/deploy.yml`, final
  step) that curls the raw `workers.dev` URL post-deploy and fails the job if
  `/start` didn't server-render — this exists because the deploy pipeline was
  once silently broken (deploying assets but not the Worker script). Keep
  this check (or an equivalent) if the deploy workflow is ever restructured.

---

## Deployment

Deployment is automated: pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm test`, then `wrangler deploy` using the `CLOUDFLARE_API_TOKEN` repo secret, then a post-deploy smoke check against the live Worker.

To deploy manually:

```bash
npx wrangler deploy
```

Requires a Cloudflare account with Workers enabled. Authenticate first with `wrangler login`.

---

## License

MIT
