## [https://ungcyberunit.org/](https://ungcyberunit.org/)

# CyberUnit @ UNG

An interactive cybersecurity education website for the **University of North Georgia Boar's Head Brigade Cyber Unit**.

Covers beginner cybersecurity topics with quizzes, an about page with the unit's org structure and sister organization (CyberHawks), an SOP link, user accounts with progress tracking (including throwaway guest sessions that can be upgraded into a real account without losing progress), and instructor-hosted live Quiz Rooms with public/private/student-only visibility and free-response grading.

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

## Accounts

- **Register / Login** — standard username + password, PBKDF2-hashed, session cookie is a signed JWT.
- **Guest sessions** — "Continue as Guest" (in the sign-in modal) creates a throwaway account with no password, capped at a **2-hour** session. Guests can take quizzes and rack up progress like anyone else, but can't view announcements, have a public profile, or be ranked on the leaderboard. Guest rows that never upgrade are auto-deleted by the hourly cron once their session expires (see Scheduled Cleanup below) — there's no way to log back into one, so there's nothing worth keeping.
- **Save Progress (guest → real account)** — a guest sees a **"Save Progress"** button in the navbar instead of a username link. It opens the register form in an "upgrade" mode that posts to `/api/auth/upgrade`, which converts the *same* underlying row in place (same id, new username/password, role flipped to `member`) rather than creating a separate account — so quiz progress and streak carry over automatically with no migration step.
- **Roles** — `guest` < `member` < `student` < `instructor` < `admin`. `student` is admin-assigned only (via the Admin Panel's role dropdown, `PATCH /api/admin/users/:id`) — there's no self-service path to it. It gates `/student-hub` and Student-visibility Quiz Rooms.
- **Email verification** is a general-purpose, role-decoupled identity/recovery marker — any signed-in non-guest member can confirm any email address on their account. It does **not** grant the `student` role by itself; it also backs the forgot-password/forgot-username flows.
- **Public/private profiles** — `/u/:username` shows a member's public profile if they've opted in via the toggle on `/profile`. Admins can open any profile from the Admin Panel (click a username) regardless of that toggle; the returned data is always the same strict whitelisted field set either way.

---

## Quiz Rooms

Instructors can host live quizzes separate from the self-paced topic quizzes above:

- **Question sources** — build questions manually in the Instructor Panel (card-based builder), or import a `.csv`/`.json` file. Both support two question types:
  - **Multiple choice** — 2–4 answers, auto-graded on submit.
  - **Free response** — student types an answer; scored as *pending* until an instructor manually grades it correct/incorrect from the results page. The attempt shows a tentative score in the meantime.
- **Visibility** — a room is **Private** (default, join by code only), **Public** (also listed for any logged-in member to browse and join on the **Join Room** page, at `/quiz`), or **Student** (like Public, but only visible/joinable to accounts with the admin-assigned `student` role — see Accounts below).
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
| Auth | Custom JWT (HS256) + PBKDF2 password hashing; HttpOnly, `SameSite=Strict`, `Secure`-when-HTTPS session cookie. Member/instructor/admin sessions last 7 days, guest sessions are capped at 2 hours and can never self-heal into a longer-lived cookie (closes a stale-guest-cookie replay path — see `CLAUDE.md`) |
| Input validation | Server-side length caps on all Quiz Room fields, 1MB question-file cap, CSV/formula-injection sanitization on exported reports, parameterized SQL throughout. Topic-quiz scores are computed server-side from the real answer key (client submits selected answer indices, never a raw score) |
| Rate limiting | Per-IP sliding windows on account creation (register + guest, 10/hr), the public feedback form (5/hr), and forgot-password/forgot-username (5/hr); all self-prune on write, with hourly cron cleanup for residual rows once traffic stops |
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
│   ├── student-hub.html   # Student-only Quiz Rooms (gated to the `student` role+)
│   ├── quiz.html          # "Join Room" page: browse public rooms + join by code
│   ├── quiz-room.html     # Student: live Quiz Room attempt
│   ├── profile.html, u.html    # Own profile / another member's public profile
│   ├── leaderboard.html, announcements.html, contact.html  # Other member-facing pages
│   ├── css/               # Global stylesheet
│   ├── images/            # Topic images
│   └── js/                # Client-side scripts
│       ├── main.js          # Nav/auth/profile/quiz/admin-panel client logic, per-page init dispatch
│       ├── start.js          # /start pathway page enhancement
│       └── topic-render.js  # Isomorphic: topic lesson-content renderer, imported by both worker.js and main.js
├── worker.js              # Cloudflare Worker — the only entry point: routing, API, auth, security headers
├── schema.sql              # D1 schema (users [incl. role/streak/last_active/is_public], quiz_results, quiz_rooms, quiz_room_questions, quiz_room_attempts, quiz_room_answers, announcements, feedback, and the room_lookup_failures/feedback_rate_limit/email_action_rate_limit/signup_rate_limit sliding-window rate-limit tables)
├── test/worker.test.mjs    # Unit tests (see Tests below)
├── wrangler.toml           # Cloudflare Workers configuration
└── package.json
```

> **Note:** an earlier `server.js` (an Express prototype predating the account
> system, D1 database, and Quiz Rooms) was removed on 2026-07-30, along with
> its `express`/`nodemon` dependencies. It was never deployed — `worker.js`
> has been the sole entry point since the Cloudflare Workers migration — and
> had drifted far enough from current functionality (no login, progress
> tracking, admin/instructor panels, or Quiz Rooms) that keeping it around as
> a "preview" was actively misleading. `npm start` now runs `wrangler dev`.

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
| `/student-hub` | Student-only quiz rooms — gated to the admin-assigned `student` role and above |
| `/quiz` | **Join Room** — browse public Quiz Rooms, or enter a private room code |
| `/quiz/:code` | Student — take a live Quiz Room / view your result |
| `/profile` | Logged-in user's profile — account info + rank, pathway badges, topic progress, Quiz Room history (click your username in the navbar). Includes a public/private visibility toggle and the guest "Save Progress" upgrade flow. |
| `/leaderboard` | Top Performers leaderboard (member-facing; also a section on the profile). Usernames link to `/u/:username`. Guests are excluded from ranking. |
| `/u/:username` | Public view of a member's profile (username, avatar, member-since, pathway badges, module/room rank) — only if they've opted in via the profile toggle, or if the viewer is an admin (who can bypass the privacy gate from the Admin Panel). Otherwise shows a "private" state. `noindex`, not in the sitemap. |
| `/announcements` | Unit newsletter — signed-in members only (guests explicitly excluded, unlike most of the site). Sortable (Newest/Oldest/A-Z/Z-A cycle button) and searchable by title/date. Admins get inline create/edit/delete. |
| `/contact` | Contact Us — public feedback form (rate-limited, no login required) plus direct unit contact info |
| `/admin` | Admin panel — user/role management; click a username to open their `/u/:username` profile |

### API

| Route | Description |
|-------|-------------|
| `/api/topics` | JSON list of all topics (summary) |
| `/api/topic/:id` | JSON data for a single topic |
| `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` | Account auth. `/api/auth/me` also reports `hasUnreadAnnouncements` (always `false` for guests) — drives the nav badge. |
| `/api/auth/guest` (POST) | Create a throwaway guest account (role `guest`, 2-hour session, no password) |
| `/api/auth/upgrade` (POST) | Guest-only — converts the caller's own guest row into a real account in place (same id; new username/password; role → `member`), so progress carries over with no migration step |
| `/api/auth/forgot-password`, `/api/auth/forgot-username` (POST) | Unauthenticated account recovery via a verified email on file; always returns a generic success response regardless of whether the email matches (no enumeration) |
| `/api/auth/reset-password` (GET/POST) | Emailed reset link — `GET` only renders a form (never mutates state, so mail-security prefetchers can't silently burn the token); `POST` performs the actual reset |
| `/api/auth/verify-email/request`, `/api/auth/verify-email/confirm` (GET/POST) | Any signed-in non-guest member can confirm any email on their account (general-purpose identity/recovery marker, not role-granting); `confirm` follows the same GET-renders/POST-mutates pattern as password reset |
| `/api/progress` | Logged-in user's per-topic quiz progress |
| `/api/progress/:topicId` (POST) | Submit a quiz attempt — the client sends selected answer *indices*, and the score is computed server-side against the real answer key (never a client-supplied score) |
| `/api/profile` | Logged-in user's account details + Quiz Room attempt history + earned pathway badges + own `isPublic` flag |
| `/api/profile/avatar` (POST/DELETE) | Logged-in user — upload/remove their own avatar image (magic-byte validated, size-capped) |
| `/api/profile/visibility` (POST) | Logged-in user (non-guest) — toggle whether `/u/:username` is viewable by others |
| `/api/user/:username` | Public subset of a profile (username, avatar, member-since, badges, ranks) if that user has opted in, or if the requester is an admin; `403` if private (non-admin viewer), `404` if unknown/guest |
| `/api/leaderboard?mode=modules\|rooms` | Top performers — by topic-quiz points (`modules`, default) or quiz-room points (`rooms`); guests excluded |
| `/api/announcements` (GET) | Signed-in non-guest member — list all announcements, newest first |
| `/api/announcements` (POST), `/api/announcements/:id` (PATCH/DELETE) | Admin only — create/edit/delete; any admin can manage any post (not creator-restricted) |
| `/api/announcements/seen` (POST) | Signed-in non-guest member — stamps `users.last_seen_announcements`, clearing the nav unread badge |
| `/api/feedback` (POST) | Anyone, signed in or not — public feedback/contact form, IP rate-limited (5/hr) |
| `/api/feedback` (GET), `/api/feedback/:id` (DELETE) | Admin only — review/dismiss submissions |
| `/api/admin/users` (GET) | Admin — list all users |
| `/api/admin/users/:id` (PATCH/DELETE) | Admin — change a user's role or delete their account (cascades their quiz/room data) |
| `/api/rooms` (POST/GET) | Instructor — create a room / list your rooms |
| `/api/rooms/public` | Any logged-in member — browse open public rooms |
| `/api/rooms/:code/join` | Student — join a room, fetch its questions |
| `/api/rooms/:code/attempt` (POST) | Student — submit answers |
| `/api/rooms/:code/my-attempt` | Student — check your own result |
| `/api/rooms/:code/results` | Instructor — attempt roster for a room |
| `/api/rooms/:code` (GET/PATCH/DELETE) | Instructor — view/edit/delete a room |
| `/api/rooms/:code/attempts/:attemptId` (DELETE) | Instructor — reset a student's attempt |
| `/api/rooms/:code/answers/:answerId` (PATCH) | Instructor — grade a free-response answer |

### Scheduled Cleanup

An hourly Cron Trigger (`scheduled()` in `worker.js`, see `[triggers]` in
`wrangler.toml`) prunes expired rows from the rate-limit tables (they also
self-prune on write; this just clears residuals once traffic stops), and
batch-deletes guest accounts whose 2-hour session has expired and who never
upgraded — there's no password to log back into them, so they'd otherwise
accumulate forever. Accounts that did upgrade are never touched, regardless
of age, since their role is no longer `guest`.

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm install -g wrangler`)

### Setup

```bash
npm install
```

### Run locally

```bash
npm start        # or: npx wrangler dev
```

The site will be available at `http://localhost:8787`, backed by D1 and the full auth/Quiz Rooms feature set.

---

## Tests

```bash
npm test
```

Runs on Node's built-in test runner (`node --test`, no dependencies) against
`test/worker.test.mjs` — currently 50 suites / 185 tests. Coverage falls
into four groups:

- **Pure helpers** — `parseCookies`, `hashPassword`/`verifyPassword`, JWT
  sign/verify, `generateRoomCode`, `parseCSV`/`parseCSVLine`,
  `validateJSONQuestions`, `escapeHtml`, `dateStrUTC`, `nextStreak`,
  `pathwayBadges`, and the SEO/rendering helpers (`topicCard`, `pathwayHtml`,
  `topicMetaTags`), all imported directly from `worker.js`.
- **API routes against a mock D1** — a hand-rolled mock (`mockDB()` in the
  test file) records every `.prepare()`/`.bind()`/`.run()`/`.first()`/`.all()`
  call, so a test can assert *exactly* what SQL ran and with what bindings —
  e.g. that `POST /api/profile/visibility` only ever updates
  `WHERE id = session.sub`, that `GET /api/user/:username` never returns a
  private field, or that `POST /api/progress/:topicId` computes the score
  from a submitted answers array against the real quiz data rather than
  trusting a client-sent score. `mockDB()` also stubs `.batch()`, so the
  `scheduled()` cron's guest-cleanup transaction can be asserted on (ordering,
  table scoping) without a real D1. This is the pattern to follow for new
  endpoints: no real D1 needed to unit-test authorization/field-whitelist
  logic.
- **Session security regression tests** — dedicated coverage for
  `refreshRoleIfStale`: a stale *non-guest* cookie still self-heals when the
  DB role has moved (e.g. after an admin promotion), but a stale *guest*
  cookie never does, even if that account was since upgraded via
  `/api/auth/upgrade` — closing a path where a captured guest cookie could
  otherwise ride an account's upgrade into a long-lived session. Both
  directions are tested so a regression in either one fails loudly.
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
- **`/topic/:id` lesson content is rendered both server-side (for crawlers /
  no-JS) and client-side**, via a single shared source of truth:
  `public/js/topic-render.js` — a dependency-free ES module with no
  DOM/browser APIs, imported by both `worker.js` and `public/js/main.js`.
  This used to be two hand-kept copies (which drifted out of sync once and
  caused a real Search Console Soft 404 — see `c205807`); if you're adding a
  new piece of content that needs to render identically on both sides,
  extend this module rather than writing it in only one place. Note this is
  *why* `main.js` loads as `<script type="module">` — see CLAUDE.md's "Adding
  a new HTML page" section if you add a page that loads it.
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

- **`worker.js` is a single ~180KB file** — routing, API handlers, auth,
  security headers, and SEO/HTML rendering all live in it. There's no build
  step, so this is deliberate (simpler deploy, no bundler), but it means new
  routes should follow the existing `path.match(...)` dispatch pattern rather
  than introducing a router abstraction — consistency matters more than DRY
  here given the file's size.
- **The isomorphic-module pattern used by `topic-render.js`** (see Best
  Practices above) is the template to reach for if another piece of
  server+client duplication shows up — a small, dependency-free ES module
  with no DOM/browser APIs, imported by both `worker.js` (Workers natively
  support ES module imports, no bundler config needed) and the relevant
  `public/js/*.js` file (loaded as `type="module"`).
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
