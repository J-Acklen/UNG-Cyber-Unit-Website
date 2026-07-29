# Plan: Public/Private Profile Toggle

**Goal:** a toggle on `/profile` that controls whether other logged-in users can
view this user's profile by clicking their username on the `/leaderboard` page.

**Status:** implemented and shipped.

---

## Chunk 0 — DECISIONS (as resolved)

- [x] **Default visibility:** private (opt-in), `DEFAULT 0`.
- [x] **What a public profile shows:** username, avatar, member-since, pathway badges,
      module rank, room rank. **Excluded:** per-topic quiz progress and quiz-room
      history — both stay private even when the profile is public.
- [x] **URL scheme:** `/u/:username`.
- [x] **Leaderboard link behavior:** every username links to `/u/:username`, regardless
      of visibility (deviates from the original "only link public" recommendation) —
      visiting a private user's page shows a generic "this profile is private" state.
- [x] **Toggle UI:** a switch in the `// Account` section on `/profile`, generated
      client-side in `main.js` (not baked into `profile.html`).

---

## Session learnings / project gotchas (READ FIRST)

These bit us this session — keep them in mind for this feature:

- **Deploy pipeline was silently broken.** The GitHub Action was deploying *assets*
  but not the *Worker script* because `cloudflare/wrangler-action@v3` had no
  `command`. Fixed by adding `command: deploy`, pinning wrangler, running `npm test`,
  and a post-deploy smoke check (`.github/workflows/deploy.yml`). **Deploys are gated
  on `npm test`** — keep tests green or nothing ships.
- **Remote D1 migration must run BEFORE the push deploys**, or prod queries a missing
  column and errors:
  `npx wrangler d1 execute DB --local  --command "ALTER TABLE users ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0"`
  then the same with `--remote`.
- **Cloudflare edge-caches HTML aggressively** (responses come back `cf-cache HIT`
  even with `no-store`). Worker-injected pages (`/`, `/start`, topics, view-routes)
  now strip the asset's `Cache-Control` and send `no-store` — keep doing that for any
  new worker-served HTML. After a deploy, a stale page may need a **Caching → Purge
  Everything** in the Cloudflare dashboard. To see *fresh* worker output bypassing the
  zone cache, hit the raw URL: `https://ung-cyber-unit-website.joshuaacklen.workers.dev/...`.
- **Static files bypass the worker.** Any new *static* HTML page must be added to
  `run_worker_first` in `wrangler.toml` to get security headers. **Dynamic paths**
  (`/topic/:id`, `/quiz/:code`, and the new `/u/:username`) already hit the worker, so
  they do NOT need a `run_worker_first` entry.
- **No inline `<script>`.** CSP `script-src` is `'self'` only — all JS lives in
  `public/js/*.js` (e.g. `main.js`). Inline scripts are blocked.
- **noindex** non-content pages (`<meta name="robots" content="noindex">`), like the
  app pages. Public profiles should be noindex too.
- **Canonical domain:** `https://ungcyberunit.org`.
- **Reusable server helpers already exist:** `pathwayBadges(doneSet)` and
  `leaderboardRank(env, table, userId, username)` — use them for the public profile.
- **Test mock DB** (`test/worker.test.mjs`) supports both `.bind().run/first/all` and
  parameterless `.all()/.first()`. Add exports + tests for any new pure helper.
- **Verification pattern:** `npx wrangler dev`, seed via `curl`, drive/screenshot in
  headless Chrome (`puppeteer-core` lives in the scratchpad dir, not the project),
  then delete test users/rows from local D1.
- **SQL-injection guard:** when a table name is chosen by mode (e.g. leaderboard), it
  comes from a fixed lookup, never user input. Keep that pattern.

### Current profile/leaderboard shape (what to build on)
- `/profile`: big green centered **username header** (`#profileName`), then `// Account`
  tiles = Role, Member Since, **Module Rank**, **Room Rank** (Username tile was removed);
  then Pathway Badges, Topic Quiz Progress, Quiz Room History. Own-only controls:
  avatar upload.
- `users` columns today: `id, username, password_hash, role, avatar, streak,
  last_active, created_at`.
- `/api/leaderboard?mode=modules|rooms` → `{ mode, top:[{rank,username,avatar,points,
  count,perfect}], me:{...} }`. Guests excluded from ranking.
- `/api/profile` → `{ id, username, role, avatar, created_at, roomAttempts, badges,
  rank, roomRank }`.

---

## Implementation checklist

### 1. Data model + migration
- [x] `schema.sql`: `is_public INTEGER NOT NULL DEFAULT 0` on `users`.
- [x] Migrate local. **Remote migration still pending — must happen before the deploy
      that ships this branch.**

### 2. Server (`worker.js`)
- [x] `/api/profile`: include the owner's `isPublic`.
- [x] `POST /api/profile/visibility`: auth required; boolean `isPublic` body; updates
      **only `session.sub`**; returns new value. Guests rejected (403).
- [x] `GET /api/user/:username`: returns the **public subset only** when `is_public=1`;
      else `403` (generic "private"); `404` unknown/guest. Reuses `pathwayBadges` +
      `leaderboardRank`. Never returns private fields.
- [ ] ~~`/api/leaderboard`: add `u.is_public` to the query + each `top` row.~~ Not
      needed — see the leaderboard link-behavior decision below.

### 3. Client — profile page (toggle)
- [x] Toggle lives in the `// Account` section, generated in `main.js` (not baked into
      `profile.html`'s static markup).
- [x] Wired in `main.js`: init from `profile.isPublic`, `POST` on change, reflect
      success/failure, revert the switch on error. No inline script.

### 4. Client — leaderboard (clickable usernames)
- [x] In `renderLeaderboard`, every username links to `/u/:username` (not gated on
      `is_public` — see decision above). Avatar + "you" layout unchanged.
- [x] CSS for the linked username (`.lb-user-cell` hover state).

### 5. Public profile view (new page)
- [x] `public/u.html` shell: navbar, container, `noindex`, loads `/js/main.js`.
- [x] Worker route: matches `/u/:username` (dynamic → hits worker like `/quiz/:code`),
      serves the shell. No `run_worker_first` entry (dynamic path).
- [x] `main.js` dispatch branch `/u/...` → `initPublicProfilePage()`: parses username,
      fetches `/api/user/:username`, renders the public subset (reuses the green name
      header, avatar, rank tiles via the extracted `rankTile()`, and `renderProfileBadges()`).
      Handles 3 states: rendered / private / 404 (+ a generic error state).
- [x] Owner-only controls (avatar upload, visibility toggle) never render on `/u/...`
      — that markup only exists in `loadProfileAccount()` for the owner's own `/profile`.

### 6. Security / privacy review (this project cares)
- [x] Toggle mutates only the caller's row (`WHERE id = session.sub`), no target id.
- [x] `/api/user/:username`: only whitelisted public fields, only when `is_public=1`;
      private → 403 (no data), unknown/guest → 404. No IDOR, no leakage — covered by
      tests that assert the private/public response bodies never contain `id`, `role`,
      `is_public`, or `roomAttempts`.
- [x] `escHtml`/`encodeURIComponent` used for others' usernames; avatars stay under CSP
      `img-src 'self' data:`.

### 7. Tests (`test/worker.test.mjs` — gates deploy)
- [x] `POST /api/profile/visibility`: requires session, rejects guests, rejects a
      non-boolean body, and updates only the caller's row (asserted via the mock DB's
      recorded bindings).
- [x] `GET /api/user/:username`: 403 private (no leaked fields), 404 unknown, 404 guest,
      public shape when public, no private fields ever present.
- [ ] ~~`/api/leaderboard`: rows include `is_public`.~~ Not applicable — see above.
- [x] Page-render test: `/u/:username` shell renders 200 + `noindex`.

### 8. Docs
- [x] `README.md`: added `/u/:username`, `/api/user/:username`,
      `/api/profile/visibility`; noted `users.is_public` in the schema line.
- [x] `CLAUDE.md`: noted the public/private convention + that `/api/user/:username`
      must never return private fields.

### 9. Deploy
- [ ] Remote migration first → commit + push (auto-deploys) → verify: toggle
      persists, public user viewable at `/u/:name`, private user shows private state,
      leaderboard links work for both public and private users. Purge cache if a page
      looks stale.

---

## Suggested build order (each a shippable chunk)
1. Migration + `is_public` in `/api/profile` + the toggle UI.
2. `GET /api/user/:username` + the `/u/:username` page.
3. Leaderboard link-gating with `is_public`.

**Riskiest part: #6** — the public endpoint must be strict about *which* users and
*which* fields it exposes.
