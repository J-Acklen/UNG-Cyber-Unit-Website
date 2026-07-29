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

## Deployment

Deployment is automated: pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `wrangler deploy` using the `CLOUDFLARE_API_TOKEN` repo secret.

To deploy manually:

```bash
npx wrangler deploy
```

Requires a Cloudflare account with Workers enabled. Authenticate first with `wrangler login`.

---

## License

MIT
