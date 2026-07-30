/* ============================================================
   Unit tests for worker.js helpers + the avatar upload endpoint.
   Run with: npm test   (Node's built-in test runner, no deps)
   ============================================================ */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import worker, {
  base64ImageMatchesType,
  parseCookies,
  timingSafeEqual,
  hashPassword,
  verifyPassword,
  signJWT,
  verifyJWT,
  generateRoomCode,
  parseCSVLine,
  parseCSV,
  validateJSONQuestions,
  escapeHtml,
  renderContent,
  getTopicSVG,
  addSecurityHeaders,
  clientIP,
  jsonResponse,
  dateStrUTC,
  nextStreak,
  topics,
  pathwayStages,
  pathwayStageTopics,
  pathwayBadges,
  topicFraming,
  topicCard,
  pathwayHtml,
  topicMetaTags,
} from '../worker.js';

// ─── Test fixtures ────────────────────────────────────────────────────────────

// Minimal but valid magic-byte prefixes, base64-encoded, for each accepted type.
const b64 = bytes => btoa(String.fromCharCode(...bytes));
// PNG signature (8 bytes) + 1 trailing byte, so length > 8.
const PNG_B64  = b64([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
// JPEG SOI+marker (FF D8 FF) + 1 byte, so length > 3.
const JPEG_B64 = b64([0xff, 0xd8, 0xff, 0xe0]);
// "RIFF"????"WEBP" + 1 byte, so length > 12.
const WEBP_B64 = btoa('RIFF\x00\x00\x00\x00WEBP\x00');

const VALID_PNG_DATAURL = `data:image/png;base64,${PNG_B64}`;
const SECRET = 'test-secret-value';

// A mock D1 database that records every prepared/bound/executed statement, so a
// test can assert whether a write actually happened (or, importantly, did not).
function mockDB() {
  const calls = [];
  // Statements can be executed with or without .bind() (D1 allows both).
  const exec = (sql, bindings) => ({
    run:   async () => { calls.push({ sql, bindings, op: 'run' });   return { meta: { last_row_id: 1 } }; },
    first: async () => { calls.push({ sql, bindings, op: 'first' }); return null; },
    all:   async () => { calls.push({ sql, bindings, op: 'all' });   return { results: [] }; },
  });
  return {
    calls,
    prepare(sql) {
      return { bind: (...bindings) => exec(sql, bindings), ...exec(sql, null) };
    },
  };
}

// A mock ASSETS binding backed by the real files in public/, so page-rendering
// tests exercise the worker's actual SSR injection (topic content, home grid,
// pathway, etc.) against the real static shells instead of fabricated HTML.
const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

function mockAssets() {
  return {
    async fetch(input) {
      const url = new URL(typeof input === 'string' ? input : input.url);
      let p = url.pathname;
      if (p === '/') p = '/index.html';
      else if (!p.includes('.')) p = `${p}.html`;
      const filePath = join(PUBLIC_DIR, p);
      if (!existsSync(filePath)) return new Response('Not found', { status: 404 });
      const contentType = p.endsWith('.pdf') ? 'application/pdf' : 'text/html; charset=utf-8';
      return new Response(readFileSync(filePath), { status: 200, headers: { 'Content-Type': contentType } });
    },
  };
}

// A mock D1 for the public-profile endpoint: resolves `SELECT ... FROM users
// WHERE username = ?` from a fixed users-by-username map, and treats any
// leaderboardRank aggregate query as "no points" (so rank comes back null
// without needing a second mocked query).
function mockPublicProfileDB(usersByUsername) {
  return {
    prepare(sql) {
      return {
        bind: (...bindings) => ({
          first: async () => {
            if (/FROM users WHERE username = \?/.test(sql)) {
              return usersByUsername[bindings[0]] ?? null;
            }
            if (/WHERE user_id = \?/.test(sql)) {
              return { points: 0, count: 0 };
            }
            return null;
          },
          all:   async () => ({ results: [] }),
          run:   async () => ({ meta: { last_row_id: 1 } }),
        }),
      };
    },
  };
}

async function sessionCookieFor(user) {
  const token = await signJWT(
    { sub: user.sub, username: user.username, role: user.role, exp: Math.floor(Date.now() / 1000) + 3600 },
    SECRET,
  );
  return `session=${token}`;
}

// ─── base64ImageMatchesType (avatar upload security control) ────────────────────

describe('base64ImageMatchesType', () => {
  test('should accept a real PNG signature under the png type', () => {
    // Happy path: canonical case the upload endpoint relies on.
    assert.equal(base64ImageMatchesType(PNG_B64, 'png'), true);
  });

  test('should accept a real JPEG signature under the jpeg type', () => {
    // Happy path for the second supported format.
    assert.equal(base64ImageMatchesType(JPEG_B64, 'jpeg'), true);
  });

  test('should accept a real WEBP (RIFF/WEBP) signature under the webp type', () => {
    // Happy path for the format the client actually produces from canvas.
    assert.equal(base64ImageMatchesType(WEBP_B64, 'webp'), true);
  });

  test('should reject HTML/script bytes smuggled under an image/png label', () => {
    // The core attack: content-type confusion that was storable before the fix.
    const htmlB64 = btoa('<script>alert(1)</script>');
    assert.equal(base64ImageMatchesType(htmlB64, 'png'), false);
  });

  test('should reject bytes whose signature does not match the declared type', () => {
    // PNG bytes labeled as jpeg — type/label mismatch must fail closed.
    assert.equal(base64ImageMatchesType(PNG_B64, 'jpeg'), false);
  });

  test('should reject an unknown/unsupported type', () => {
    // Edge case: only png/jpeg/webp are allowed; anything else falls through to false.
    assert.equal(base64ImageMatchesType(PNG_B64, 'gif'), false);
  });

  test('should return false for an empty base64 string', () => {
    // Edge case: empty input decodes to zero bytes — no signature can match.
    assert.equal(base64ImageMatchesType('', 'png'), false);
  });

  test('should return false (not throw) on invalid base64 input', () => {
    // Error handling: atob throws on illegal chars; the function must swallow it.
    assert.equal(base64ImageMatchesType('@@@not base64@@@', 'png'), false);
  });

  test('should reject a PNG signature that is exactly 8 bytes (boundary: needs > 8)', () => {
    // Boundary: the 8-byte signature alone is length 8, and the check is strictly > 8.
    const exactly8 = b64([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    assert.equal(base64ImageMatchesType(exactly8, 'png'), false);
  });

  test('should reject a JPEG marker that is exactly 3 bytes (boundary: needs > 3)', () => {
    // Boundary: FF D8 FF is length 3; the guard requires strictly more.
    const exactly3 = b64([0xff, 0xd8, 0xff]);
    assert.equal(base64ImageMatchesType(exactly3, 'jpeg'), false);
  });

  test('should reject a WEBP container that is exactly 12 bytes (boundary: needs > 12)', () => {
    // Boundary: "RIFF"+4+"WEBP" is exactly 12 bytes; needs a 13th to pass.
    const exactly12 = btoa('RIFF\x00\x00\x00\x00WEBP');
    assert.equal(base64ImageMatchesType(exactly12, 'webp'), false);
  });
});

// ─── addSecurityHeaders ─────────────────────────────────────────────────────────

describe('addSecurityHeaders', () => {
  test('should set the standard hardening headers', () => {
    const h = addSecurityHeaders(new Headers());
    assert.equal(h.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(h.get('X-Frame-Options'), 'DENY');
    assert.equal(h.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
    assert.match(h.get('Strict-Transport-Security'), /max-age=\d+/);
    assert.equal(h.get('Cross-Origin-Resource-Policy'), 'same-origin');
  });

  test('should set a CSP with no unsafe-inline/unsafe-eval in script-src', () => {
    // The whole "never write inline <script>" convention (see CLAUDE.md) is
    // only actually enforced by this header — a regression here would
    // silently reopen inline-script XSS without any other test noticing,
    // since routes would still render fine either way.
    const csp = addSecurityHeaders(new Headers()).get('Content-Security-Policy');
    const scriptSrc = csp.split(';').find(d => d.trim().startsWith('script-src'));
    assert.ok(scriptSrc, 'script-src directive present');
    assert.doesNotMatch(scriptSrc, /unsafe-inline|unsafe-eval|\*/);
  });

  test('should deny embedding via frame-ancestors', () => {
    const csp = addSecurityHeaders(new Headers()).get('Content-Security-Policy');
    assert.match(csp, /frame-ancestors 'none'/);
  });

  test('should mutate and return the same Headers instance it was given', () => {
    const input = new Headers();
    const output = addSecurityHeaders(input);
    assert.equal(output, input);
  });
});

// ─── clientIP ───────────────────────────────────────────────────────────────────

describe('clientIP', () => {
  test('should prefer CF-Connecting-IP (Cloudflare-set, not spoofable) over X-Forwarded-For', () => {
    const req = new Request('https://x.test/', {
      headers: { 'CF-Connecting-IP': '1.2.3.4', 'X-Forwarded-For': '9.9.9.9' },
    });
    assert.equal(clientIP(req), '1.2.3.4');
  });

  test('should fall back to the first hop of X-Forwarded-For', () => {
    const req = new Request('https://x.test/', { headers: { 'X-Forwarded-For': '5.6.7.8, 9.9.9.9' } });
    assert.equal(clientIP(req), '5.6.7.8');
  });

  test('should return "unknown" when neither header is present', () => {
    assert.equal(clientIP(new Request('https://x.test/')), 'unknown');
  });
});

// ─── jsonResponse ───────────────────────────────────────────────────────────────

describe('jsonResponse', () => {
  test('should set JSON content-type and default to 200', async () => {
    const res = jsonResponse({ ok: true });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(await res.json(), { ok: true });
  });

  test('should honor a custom status and always include security headers', () => {
    const res = jsonResponse({ error: 'nope' }, 403);
    assert.equal(res.status, 403);
    assert.equal(res.headers.get('X-Frame-Options'), 'DENY');
  });

  test('should apply extra headers without dropping the security ones', () => {
    const res = jsonResponse({}, 200, { 'X-Custom': 'yes' });
    assert.equal(res.headers.get('X-Custom'), 'yes');
    assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  });
});

// ─── parseCookies ───────────────────────────────────────────────────────────────

describe('parseCookies', () => {
  test('should parse multiple cookies into a key/value map', () => {
    // Happy path.
    assert.deepEqual(parseCookies('session=abc; theme=dark'), { session: 'abc', theme: 'dark' });
  });

  test('should return an empty object for an empty or missing header', () => {
    // Edge case: logged-out requests send no Cookie header.
    assert.deepEqual(parseCookies(''), {});
    assert.deepEqual(parseCookies(undefined), {});
  });

  test('should preserve "=" characters inside a cookie value (e.g. base64/JWT)', () => {
    // Edge case: JWTs contain "=" padding; splitting must not truncate the value.
    assert.deepEqual(parseCookies('session=a=b=c'), { session: 'a=b=c' });
  });

  test('should trim surrounding whitespace from names and values', () => {
    // Edge case: servers may emit "; " separators with padding.
    assert.deepEqual(parseCookies('  a = 1 ;  b = 2 '), { a: '1', b: '2' });
  });
});

// ─── timingSafeEqual ────────────────────────────────────────────────────────────

describe('timingSafeEqual', () => {
  test('should return true for identical strings', () => {
    // Happy path.
    assert.equal(timingSafeEqual('deadbeef', 'deadbeef'), true);
  });

  test('should return false for strings of different length', () => {
    // Boundary: unequal length short-circuits before comparison.
    assert.equal(timingSafeEqual('abc', 'abcd'), false);
  });

  test('should return false for same-length differing strings', () => {
    // Core case: one differing char must fail.
    assert.equal(timingSafeEqual('abcd', 'abce'), false);
  });

  test('should return true for two empty strings', () => {
    // Edge case: empty inputs are equal.
    assert.equal(timingSafeEqual('', ''), true);
  });
});

// ─── hashPassword / verifyPassword (PBKDF2 side effects via WebCrypto) ───────────

describe('password hashing', () => {
  test('should verify a password against its own hash', async () => {
    // Happy path: round-trip must succeed.
    const hash = await hashPassword('correct horse battery staple');
    assert.equal(await verifyPassword('correct horse battery staple', hash), true);
  });

  test('should reject an incorrect password', async () => {
    // Core security case: wrong password must not verify.
    const hash = await hashPassword('hunter2hunter2');
    assert.equal(await verifyPassword('wrong-password', hash), false);
  });

  test('should produce a "salt:hash" hex-encoded string', async () => {
    // Structure check: downstream split(":") depends on this shape.
    const hash = await hashPassword('anything123');
    assert.match(hash, /^[0-9a-f]{32}:[0-9a-f]{64}$/);
  });

  test('should use a random salt so identical passwords hash differently', async () => {
    // Side effect: crypto.getRandomValues salt means no two hashes collide.
    const a = await hashPassword('samepass');
    const b = await hashPassword('samepass');
    assert.notEqual(a, b);
  });
});

// ─── signJWT / verifyJWT ────────────────────────────────────────────────────────

describe('JWT sign/verify', () => {
  test('should round-trip a payload through sign then verify', async () => {
    // Happy path.
    const token = await signJWT({ sub: 7, role: 'admin' }, SECRET);
    const payload = await verifyJWT(token, SECRET);
    assert.equal(payload.sub, 7);
    assert.equal(payload.role, 'admin');
  });

  test('should return null when verified with the wrong secret', async () => {
    // Security: a token signed elsewhere must not validate.
    const token = await signJWT({ sub: 1 }, SECRET);
    assert.equal(await verifyJWT(token, 'a-different-secret'), null);
  });

  test('should return null for a tampered signature', async () => {
    // Security: flipping the payload without re-signing must fail.
    const token = await signJWT({ sub: 1, role: 'member' }, SECRET);
    const [h, , s] = token.split('.');
    const forgedBody = btoa(JSON.stringify({ sub: 1, role: 'admin' })).replace(/=/g, '');
    assert.equal(await verifyJWT(`${h}.${forgedBody}.${s}`, SECRET), null);
  });

  test('should return null for an expired token', async () => {
    // Boundary: exp one second in the past must be rejected.
    const token = await signJWT({ sub: 1, exp: Math.floor(Date.now() / 1000) - 1 }, SECRET);
    assert.equal(await verifyJWT(token, SECRET), null);
  });

  test('should return null for a malformed token (not three parts)', async () => {
    // Error handling: garbage input must not throw.
    assert.equal(await verifyJWT('not-a-jwt', SECRET), null);
  });
});

// ─── generateRoomCode ───────────────────────────────────────────────────────────

describe('generateRoomCode', () => {
  test('should match the XXXX-XXXX format with an allowed charset', () => {
    // Happy path + format contract used by the route matcher.
    assert.match(generateRoomCode(), /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
  });

  test('should never contain visually ambiguous characters (I, O, 0, 1)', () => {
    // Edge case: the alphabet deliberately omits look-alikes to avoid typos.
    for (let i = 0; i < 200; i++) {
      assert.doesNotMatch(generateRoomCode(), /[IO01]/);
    }
  });
});

// ─── parseCSVLine ───────────────────────────────────────────────────────────────

describe('parseCSVLine', () => {
  test('should split a simple comma-separated line', () => {
    // Happy path.
    assert.deepEqual(parseCSVLine('a,b,c'), ['a', 'b', 'c']);
  });

  test('should keep commas that are inside quoted fields', () => {
    // Core CSV rule: quotes protect embedded delimiters.
    assert.deepEqual(parseCSVLine('"a,b",c'), ['a,b', 'c']);
  });

  test('should unescape doubled quotes inside a quoted field', () => {
    // Edge case: "" is the CSV escape for a literal quote.
    assert.deepEqual(parseCSVLine('"say ""hi""",x'), ['say "hi"', 'x']);
  });

  test('should return a single empty field for an empty line', () => {
    // Edge case: empty input still yields one (empty) column.
    assert.deepEqual(parseCSVLine(''), ['']);
  });
});

// ─── parseCSV ───────────────────────────────────────────────────────────────────

describe('parseCSV', () => {
  test('should parse a header plus one multiple-choice question', () => {
    // Happy path.
    const csv = 'question,answer_a,answer_b,correct\nWhat is 2+2?,3,4,1';
    const result = parseCSV(csv);
    assert.equal(result.error, undefined);
    assert.equal(result.questions.length, 1);
    assert.deepEqual(result.questions[0].answers, ['3', '4']);
    assert.equal(result.questions[0].correct, 1);
  });

  test('should parse a free_response row with no answers', () => {
    // Branch: free_response skips answer/correct validation.
    const csv = 'question,type\nExplain TLS.,free_response';
    const result = parseCSV(csv);
    assert.equal(result.questions[0].type, 'free_response');
    assert.deepEqual(result.questions[0].answers, []);
    assert.equal(result.questions[0].correct, null);
  });

  test('should error when only a header row is present', () => {
    // Edge case: no questions means nothing to import.
    assert.match(parseCSV('question,answer_a').error, /header row and at least one/);
  });

  test('should error when the required "question" column is missing', () => {
    // Error handling: the schema requires a question column.
    assert.match(parseCSV('foo,bar\n1,2').error, /Missing required CSV column/);
  });

  test('should error when a multiple-choice row has fewer than 2 answers', () => {
    // Boundary: MC questions need at least two options.
    assert.match(parseCSV('question,answer_a,correct\nQ,only,0').error, /at least 2 non-empty/);
  });

  test('should error when "correct" is out of range', () => {
    // Boundary: correct index must be within the answers array.
    assert.match(parseCSV('question,answer_a,answer_b,correct\nQ,a,b,5').error, /"correct" must be 0/);
  });

  test('should error when more than 100 questions are supplied', () => {
    // Large input: the 100-question cap must reject 101 rows.
    const rows = Array.from({ length: 101 }, (_, i) => `Q${i},a,b,0`).join('\n');
    assert.match(parseCSV(`question,answer_a,answer_b,correct\n${rows}`).error, /Maximum 100/);
  });
});

// ─── validateJSONQuestions ──────────────────────────────────────────────────────

describe('validateJSONQuestions', () => {
  test('should accept a well-formed question array', () => {
    // Happy path.
    const result = validateJSONQuestions([
      { question: 'Q1', answers: ['a', 'b'], correct: 0 },
    ]);
    assert.equal(result.error, undefined);
    assert.equal(result.questions.length, 1);
  });

  test('should error when input is not an array', () => {
    // Error handling: a bare object / string is invalid.
    assert.match(validateJSONQuestions({ question: 'x' }).error, /must be an array/);
  });

  test('should error on an empty array', () => {
    // Edge case: at least one question is required.
    assert.match(validateJSONQuestions([]).error, /At least one question/);
  });

  test('should error when question text is missing or blank', () => {
    // Error handling: whitespace-only text is treated as missing.
    assert.match(validateJSONQuestions([{ question: '   ', answers: ['a', 'b'], correct: 0 }]).error, /question text is required/);
  });

  test('should error when a multiple-choice question has too many answers', () => {
    // Boundary: 2–4 answers only; 5 must fail.
    assert.match(validateJSONQuestions([{ question: 'Q', answers: ['a', 'b', 'c', 'd', 'e'], correct: 0 }]).error, /must have 2–4 answers/);
  });

  test('should error when correct index is out of range', () => {
    // Boundary: correct must point at an existing answer.
    assert.match(validateJSONQuestions([{ question: 'Q', answers: ['a', 'b'], correct: 2 }]).error, /correct must be 0/);
  });

  test('should error when more than 100 questions are supplied', () => {
    // Large input: enforce the same 100-question cap as CSV.
    const many = Array.from({ length: 101 }, (_, i) => ({ question: `Q${i}`, answers: ['a', 'b'], correct: 0 }));
    assert.match(validateJSONQuestions(many).error, /Maximum 100/);
  });
});

// ─── Endpoint: POST /api/profile/avatar (side effects via mocked D1) ─────────────

describe('POST /api/profile/avatar', () => {
  const makeReq = (avatar, cookie) => new Request('https://example.com/api/profile/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify({ avatar }),
  });

  test('should store a valid image and write it to the database', async () => {
    // Happy path + side effect: a real PNG must reach an UPDATE on the DB.
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 42, username: 'alice', role: 'member' });
    const res = await worker.fetch(makeReq(VALID_PNG_DATAURL, cookie), { JWT_SECRET: SECRET, DB: db });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.avatar, VALID_PNG_DATAURL);
    // The write must have happened, bound to this user's id.
    const write = db.calls.find(c => c.op === 'run' && /UPDATE users SET avatar/.test(c.sql));
    assert.ok(write, 'expected an UPDATE users SET avatar write');
    assert.deepEqual(write.bindings, [VALID_PNG_DATAURL, 42]);
  });

  test('should reject non-image content mislabeled as image/png without touching the DB', async () => {
    // Security + side-effect absence: rejected uploads must not write anything.
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 42, username: 'alice', role: 'member' });
    const payload = `data:image/png;base64,${btoa('<script>alert(1)</script>')}`;
    const res = await worker.fetch(makeReq(payload, cookie), { JWT_SECRET: SECRET, DB: db });

    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /not a valid image/);
    assert.equal(db.calls.length, 0, 'no DB writes should occur on rejection');
  });

  test('should reject an oversized payload (> 150000 chars) without touching the DB', async () => {
    // Boundary + DoS guard: length cap must trip before any decode/DB work.
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 42, username: 'alice', role: 'member' });
    const huge = `data:image/png;base64,${'A'.repeat(150_001)}`;
    const res = await worker.fetch(makeReq(huge, cookie), { JWT_SECRET: SECRET, DB: db });

    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /too large/i);
    assert.equal(db.calls.length, 0);
  });

  test('should reject a non-string avatar value', async () => {
    // Error handling: a numeric/array avatar must be refused, not coerced.
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 42, username: 'alice', role: 'member' });
    const res = await worker.fetch(makeReq(12345, cookie), { JWT_SECRET: SECRET, DB: db });

    assert.equal(res.status, 400);
    assert.equal(db.calls.length, 0);
  });

  test('should reject an unauthenticated request with 401', async () => {
    // Access control: no session cookie means no upload.
    const db = mockDB();
    const res = await worker.fetch(makeReq(VALID_PNG_DATAURL, undefined), { JWT_SECRET: SECRET, DB: db });

    assert.equal(res.status, 401);
    assert.equal(db.calls.length, 0);
  });
});

// ─── escapeHtml ─────────────────────────────────────────────────────────────────

describe('escapeHtml', () => {
  test('should escape the five HTML-significant characters', () => {
    // Core: prevents injection when interpolating into HTML.
    assert.equal(escapeHtml(`&<>"'`), '&amp;&lt;&gt;&quot;&#039;');
  });

  test('should leave safe text unchanged', () => {
    // Happy path: ordinary text (incl. an em dash) passes through.
    assert.equal(escapeHtml('Passwords — done'), 'Passwords — done');
  });

  test('should coerce non-strings to a string', () => {
    // Edge case: numbers/undefined must not throw.
    assert.equal(escapeHtml(42), '42');
    assert.equal(escapeHtml(undefined), 'undefined');
  });
});

// ─── getTopicSVG ────────────────────────────────────────────────────────────────
// Shared with public/js/main.js via public/js/topic-render.js — see CLAUDE.md.

describe('getTopicSVG', () => {
  test('should return an empty string for an unknown topic id', () => {
    // No matching diagram — the caller (renderTopicPage/worker route) should
    // just render nothing rather than a broken/undefined chunk of markup.
    assert.equal(getTopicSVG('99', '🛡️', 'Nonexistent Topic'), '');
  });

  test('should wrap a known topic id\'s diagram in a labeled, accessible container', () => {
    const html = getTopicSVG('01', '🛡️', 'What is Cybersecurity?');
    assert.match(html, /class="topic-svg-wrap"/);
    assert.match(html, /role="img"/);
    assert.match(html, /aria-label="What is Cybersecurity\? illustration"/);
    assert.match(html, /<svg/);
  });

  test('should escape the title in the aria-label', () => {
    // topic.title is escaped everywhere else it's used (topicCard,
    // topicMetaTags) — this wrapper must match, or a title containing a
    // quote/angle-bracket would break the attribute or inject markup.
    const html = getTopicSVG('01', '🛡️', `"><script>alert(1)</script>`);
    assert.doesNotMatch(html, /<script>alert/);
    assert.match(html, /aria-label="&quot;&gt;&lt;script&gt;/);
  });
});

// ─── renderContent ──────────────────────────────────────────────────────────────
// Full topic content (all 11 real topics) is covered end-to-end by the
// GET /topic/:id tests below; these are narrower, faster checks that each
// section-type branch produces its expected fragment from a minimal fixture.

describe('renderContent', () => {
  test('should render a plain heading+body section', () => {
    const html = renderContent({ fullContent: { sections: [
      { heading: 'Intro', body: 'Some text.' },
    ] } });
    assert.match(html, /<h3>Intro<\/h3>/);
    assert.match(html, /<p>Some text\.<\/p>/);
  });

  test('should render the CIA triad, threat cards, and a callout when flagged', () => {
    const html = renderContent({ fullContent: { sections: [
      { heading: 'CIA', cia: true },
      { heading: 'Threats', threats: [{ icon: '🎣', name: 'Phishing', desc: 'Fake emails.' }] },
      { heading: 'Note', callout: { type: 'warn', text: 'Careful!' } },
    ] } });
    assert.match(html, /class="cia-triad"/);
    assert.match(html, /Confidentiality/);
    assert.match(html, /Phishing/);
    assert.match(html, /class="callout callout-warn"/);
  });

  test('should render the optional mentor hook and key takeaway around the sections', () => {
    const withFraming = renderContent({
      hook: 'Why this matters.',
      takeaway: 'The one thing to remember.',
      fullContent: { sections: [{ heading: 'X', body: 'Y' }] },
    });
    assert.match(withFraming, /class="topic-hook"/);
    assert.match(withFraming, /class="topic-takeaway"/);

    const withoutFraming = renderContent({ fullContent: { sections: [{ heading: 'X', body: 'Y' }] } });
    assert.doesNotMatch(withoutFraming, /topic-hook/);
    assert.doesNotMatch(withoutFraming, /topic-takeaway/);
  });
});

// ─── dateStrUTC ─────────────────────────────────────────────────────────────────

describe('dateStrUTC', () => {
  test('should return today as a YYYY-MM-DD string', () => {
    // Happy path + format contract used by the streak.
    assert.match(dateStrUTC(0), /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(dateStrUTC(0), new Date().toISOString().slice(0, 10));
  });

  test('yesterday should be exactly one day before today', () => {
    // Boundary: the streak logic depends on this being calendar-correct.
    const today = new Date(dateStrUTC(0) + 'T00:00:00Z');
    const yesterday = new Date(dateStrUTC(-1) + 'T00:00:00Z');
    assert.equal((today - yesterday) / 86400000, 1);
  });
});

// ─── nextStreak (daily learning streak) ─────────────────────────────────────────

describe('nextStreak', () => {
  const today = '2026-07-16';
  const yesterday = '2026-07-15';

  test('should start a streak at 1 for a brand-new user', () => {
    // Edge case: no prior streak or last-active date.
    assert.equal(nextStreak(0, null, today, yesterday), 1);
    assert.equal(nextStreak(undefined, undefined, today, yesterday), 1);
  });

  test('should increment when the last activity was yesterday', () => {
    // Core: consecutive days extend the streak.
    assert.equal(nextStreak(3, yesterday, today, yesterday), 4);
  });

  test('should stay unchanged when already active today', () => {
    // Core: multiple sessions in one day do not inflate the streak.
    assert.equal(nextStreak(4, today, today, yesterday), 4);
  });

  test('should reset to 1 after a gap of more than one day', () => {
    // Core: a missed day breaks the streak.
    assert.equal(nextStreak(9, '2026-07-10', today, yesterday), 1);
  });

  test('should treat a same-day user with 0 streak as 1', () => {
    // Boundary: guards against showing a 0-day "streak".
    assert.equal(nextStreak(0, today, today, yesterday), 1);
  });
});

// ─── Pathway data integrity ─────────────────────────────────────────────────────

describe('pathwayStages', () => {
  test('should cover every topic exactly once across all stages', () => {
    // Core: a topic missing from (or duplicated in) the pathway is a content bug.
    const ids = pathwayStages.flatMap(s => s.topicIds).sort();
    const topicIds = topics.map(t => t.id).sort();
    assert.deepEqual(ids, topicIds);
    assert.equal(new Set(ids).size, ids.length, 'no duplicate topic ids');
  });

  test('every stage should have a valid track, badge, hook, and title', () => {
    // Structure: the /start renderer relies on all these fields.
    for (const s of pathwayStages) {
      assert.ok(['Everyone', 'Aspiring Pro'].includes(s.track), `track: ${s.track}`);
      assert.ok(s.badge?.name && s.badge?.icon, 'badge name + icon');
      assert.ok(s.hook && s.title, 'hook + title');
      assert.ok(Array.isArray(s.topicIds) && s.topicIds.length > 0, 'non-empty topicIds');
    }
  });

  test('pathwayStageTopics should resolve ids to topic objects in order', () => {
    // Core: the renderer maps stage ids to real topics.
    const stage = { topicIds: ['02', '04'] };
    assert.deepEqual(pathwayStageTopics(stage).map(t => t.id), ['02', '04']);
  });

  test('pathwayStageTopics should drop ids that do not resolve', () => {
    // Edge case: a bad id must not produce an undefined entry.
    assert.deepEqual(pathwayStageTopics({ topicIds: ['01', 'zz'] }).map(t => t.id), ['01']);
  });
});

// ─── topicFraming (hook + takeaway) ─────────────────────────────────────────────

describe('topicFraming', () => {
  test('every topic should have a non-empty hook and takeaway', () => {
    // Content: each topic page renders these; a missing one leaves a gap.
    for (const t of topics) {
      assert.ok(topicFraming[t.id]?.hook?.length > 0, `hook for ${t.id}`);
      assert.ok(topicFraming[t.id]?.takeaway?.length > 0, `takeaway for ${t.id}`);
    }
  });
});

// ─── topicCard / pathwayHtml rendering ──────────────────────────────────────────

describe('topicCard', () => {
  test('should render a linked module card with a data-topic hook', () => {
    // Happy path: card links to the topic and is tagged for client progress.
    const html = topicCard({ id: '01', title: 'X', icon: '🛡️', shortDesc: 'Y', difficulty: 'Beginner' });
    assert.match(html, /href="\/topic\/01"/);
    assert.match(html, /data-topic="01"/);
    assert.match(html, /class="card card-link"/);
  });

  test('should HTML-escape title and description', () => {
    // Security: an ampersand/quote in content must not break the markup.
    const html = topicCard({ id: '03', title: 'Passwords & Auth', icon: '🔑', shortDesc: 'a "b"', difficulty: 'Beginner' });
    assert.match(html, /Passwords &amp; Auth/);
    assert.match(html, /a &quot;b&quot;/);
    assert.doesNotMatch(html, /Passwords & Auth/); // raw & should not survive
  });
});

describe('pathwayHtml', () => {
  const html = pathwayHtml();

  test('should render all six stages and every topic module', () => {
    // Core: the server-rendered pathway must contain the full content.
    assert.equal((html.match(/class="pw-stage"/g) || []).length, pathwayStages.length);
    assert.equal((html.match(/class="card card-link"/g) || []).length, topics.length);
  });

  test('should include both track labels', () => {
    // Structure: Everyone and Aspiring-Pro stages both present.
    assert.match(html, /pw-track--everyone/);
    assert.match(html, /pw-track--aspiring-pro/);
  });
});

// ─── topicMetaTags (per-topic SEO head) ─────────────────────────────────────────

describe('topicMetaTags', () => {
  const tags = topicMetaTags({ id: '03', title: 'Passwords & Authentication', shortDesc: 'Understand MFA.' });

  test('should include an escaped title, description, canonical, and breadcrumb', () => {
    // Core SEO fields injected into the topic page head.
    assert.match(tags, /<title>Passwords &amp; Authentication — UNG Cyber Unit<\/title>/);
    assert.match(tags, /<meta name="description"/);
    assert.match(tags, /rel="canonical" href="https:\/\/ungcyberunit\.org\/topic\/03"/);
    assert.match(tags, /BreadcrumbList/);
  });

  test('breadcrumb JSON-LD should be valid JSON and escape "<"', () => {
    // Security: the JSON-LD block must parse and can't break out of </script>.
    const m = tags.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    assert.ok(m, 'has a JSON-LD script');
    const data = JSON.parse(m[1].replace(/\\u003c/g, '<'));
    assert.equal(data['@type'], 'BreadcrumbList');
    assert.equal(data.itemListElement.at(-1).name, 'Passwords & Authentication');
    assert.doesNotMatch(tags, /<\/script><\/script>/);
  });
});

// ─── Endpoints: sitemap, robots, topic framing ──────────────────────────────────

describe('GET /sitemap.xml', () => {
  test('should list the homepage, /start, and every topic as absolute URLs', async () => {
    // SEO: the sitemap must stay in sync with the topics and include the pathway.
    const res = await worker.fetch(new Request('https://example.com/sitemap.xml'), {});
    assert.equal(res.status, 200);
    assert.match(res.headers.get('Content-Type'), /application\/xml/);
    const body = await res.text();
    assert.match(body, /<loc>https:\/\/ungcyberunit\.org\/<\/loc>/);
    assert.match(body, /<loc>https:\/\/ungcyberunit\.org\/start<\/loc>/);
    for (const t of topics) {
      assert.ok(body.includes(`/topic/${t.id}</loc>`), `sitemap includes topic ${t.id}`);
    }
  });
});

describe('GET /robots.txt', () => {
  test('should be plain text and point to the sitemap', async () => {
    // Crawlers: robots must advertise the sitemap and not leak private routes.
    const res = await worker.fetch(new Request('https://example.com/robots.txt'), {});
    assert.equal(res.status, 200);
    assert.match(res.headers.get('Content-Type'), /text\/plain/);
    const body = await res.text();
    assert.match(body, /Sitemap: https:\/\/ungcyberunit\.org\/sitemap\.xml/);
    assert.doesNotMatch(body, /\/admin|\/instructor|\/profile/); // don't advertise private pages
  });
});

describe('GET /api/topic/:id', () => {
  test('should merge the topic framing (hook + takeaway) into the response', async () => {
    // Integration: the topic page depends on the API returning its framing.
    const res = await worker.fetch(new Request('https://example.com/api/topic/01'), {});
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.id, '01');
    assert.equal(data.hook, topicFraming['01'].hook);
    assert.equal(data.takeaway, topicFraming['01'].takeaway);
  });

  test('should 404 for an unknown topic id', async () => {
    // Error handling.
    const res = await worker.fetch(new Request('https://example.com/api/topic/zz'), {});
    assert.equal(res.status, 404);
  });
});

// ─── pathwayBadges (profile badge shelf) ────────────────────────────────────────

describe('pathwayBadges', () => {
  test('should return one badge per stage, all locked with no progress', () => {
    // Baseline: a brand-new user has earned nothing but sees the full shelf.
    const badges = pathwayBadges(new Set());
    assert.equal(badges.length, pathwayStages.length);
    assert.ok(badges.every(b => b.earned === false));
    assert.equal(badges[0].href, '/start#stage-1');
  });

  test('should mark a stage earned only when ALL its topics are complete', () => {
    // Stage 1 is a single topic (01); completing it earns exactly one badge.
    const badges = pathwayBadges(new Set(['01']));
    assert.equal(badges.find(b => b.num === 1).earned, true);
    assert.equal(badges.filter(b => b.earned).length, 1);
  });

  test('should NOT earn a multi-topic stage that is only partly done', () => {
    // Stage 2 needs topics 02 and 04 — one of them is not enough.
    const badges = pathwayBadges(new Set(['02']));
    assert.equal(badges.find(b => b.num === 2).earned, false);
  });

  test('every badge should carry name, icon, track, and a stage link', () => {
    // Shape the profile UI depends on.
    for (const b of pathwayBadges(new Set())) {
      assert.ok(b.name && b.icon && b.stageTitle);
      assert.match(b.href, /^\/start#stage-\d+$/);
    }
  });
});

// ─── GET /api/leaderboard ───────────────────────────────────────────────────────

describe('GET /api/leaderboard', () => {
  test('should require a session', async () => {
    // Access control: the leaderboard isn't exposed to anonymous requests.
    const res = await worker.fetch(
      new Request('https://example.com/api/leaderboard'),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 401);
  });

  test('should return a top[] ranking and the viewer\'s me{} summary', async () => {
    // Shape the profile leaderboard depends on (empty via the mock DB).
    const cookie = await sessionCookieFor({ sub: 1, username: 'alice', role: 'member' });
    const res = await worker.fetch(
      new Request('https://example.com/api/leaderboard', { headers: { Cookie: cookie } }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.top));
    assert.equal(data.me.username, 'alice');
    assert.equal(data.me.isGuest, false);
  });

  test('should mark a guest viewer as isGuest', async () => {
    // Guests can view but are flagged so the UI shows the "not ranked" note.
    const cookie = await sessionCookieFor({ sub: 9, username: 'guest-abc', role: 'guest' });
    const res = await worker.fetch(
      new Request('https://example.com/api/leaderboard', { headers: { Cookie: cookie } }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    const data = await res.json();
    assert.equal(data.me.isGuest, true);
  });
});

// ─── GET /api/profile (auth) ────────────────────────────────────────────────────

describe('GET /api/profile', () => {
  test('should require a session', async () => {
    // The profile (with rank, badges, room history) is not exposed to anonymous requests.
    const res = await worker.fetch(
      new Request('https://example.com/api/profile'),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 401);
  });
});

// ─── GET /api/leaderboard?mode= (module vs room modes) ──────────────────────────

describe('GET /api/leaderboard modes', () => {
  const call = async (q = '') => {
    const cookie = await sessionCookieFor({ sub: 1, username: 'alice', role: 'member' });
    return worker.fetch(
      new Request('https://example.com/api/leaderboard' + q, { headers: { Cookie: cookie } }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
  };

  test('should default to the modules mode', async () => {
    const data = await (await call()).json();
    assert.equal(data.mode, 'modules');
  });

  test('should honour ?mode=rooms', async () => {
    const data = await (await call('?mode=rooms')).json();
    assert.equal(data.mode, 'rooms');
  });

  test('should fall back to modules for an unknown mode', async () => {
    // Guards against SQL built from arbitrary user input — only the two known
    // modes are ever used.
    const data = await (await call('?mode=bogus')).json();
    assert.equal(data.mode, 'modules');
  });
});

// ─── POST /api/profile/visibility ───────────────────────────────────────────────

describe('POST /api/profile/visibility', () => {
  const post = (body, env) => worker.fetch(
    new Request('https://example.com/api/profile/visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    env,
  );

  test('should require a session', async () => {
    const res = await post({ isPublic: true }, { JWT_SECRET: SECRET, DB: mockDB() });
    assert.equal(res.status, 401);
  });

  test('should reject guests', async () => {
    const cookie = await sessionCookieFor({ sub: 9, username: 'guest-abc', role: 'guest' });
    const res = await worker.fetch(
      new Request('https://example.com/api/profile/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ isPublic: true }),
      }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 403);
  });

  test('should reject a non-boolean body', async () => {
    const cookie = await sessionCookieFor({ sub: 1, username: 'alice', role: 'member' });
    const res = await worker.fetch(
      new Request('https://example.com/api/profile/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ isPublic: 'yes' }),
      }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 400);
  });

  test('should update only the caller\'s own row', async () => {
    // IDOR guard: the UPDATE must be scoped to session.sub, never a target id
    // taken from the request body.
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 42, username: 'alice', role: 'member' });
    const res = await worker.fetch(
      new Request('https://example.com/api/profile/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ isPublic: true }),
      }),
      { JWT_SECRET: SECRET, DB: db },
    );
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.isPublic, true);
    const update = db.calls.find(c => c.op === 'run');
    assert.match(update.sql, /UPDATE users SET is_public = \? WHERE id = \?/);
    assert.deepEqual(update.bindings, [1, 42]);
  });
});

// ─── GET /api/user/:username (public profile) ───────────────────────────────────

describe('GET /api/user/:username', () => {
  test('should 404 for an unknown username', async () => {
    const res = await worker.fetch(
      new Request('https://example.com/api/user/nobody'),
      { DB: mockPublicProfileDB({}) },
    );
    assert.equal(res.status, 404);
  });

  test('should 404 for a guest account (not viewable even if flagged public)', async () => {
    const db = mockPublicProfileDB({
      'guest-abc': { id: 9, username: 'guest-abc', role: 'guest', avatar: null, created_at: 1000, is_public: 1 },
    });
    const res = await worker.fetch(new Request('https://example.com/api/user/guest-abc'), { DB: db });
    assert.equal(res.status, 404);
  });

  test('should 403 for a private profile without leaking any fields', async () => {
    const db = mockPublicProfileDB({
      bob: { id: 2, username: 'bob', role: 'member', avatar: null, created_at: 1000, is_public: 0 },
    });
    const res = await worker.fetch(new Request('https://example.com/api/user/bob'), { DB: db });
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.ok(!('badges' in data));
    assert.ok(!('rank' in data));
    assert.ok(!('avatar' in data));
  });

  test('should return only the whitelisted public fields for a public profile', async () => {
    const db = mockPublicProfileDB({
      alice: { id: 1, username: 'alice', role: 'member', avatar: 'data:image/png;base64,x', created_at: 1000, is_public: 1 },
    });
    const res = await worker.fetch(new Request('https://example.com/api/user/alice'), { DB: db });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.username, 'alice');
    assert.equal(data.avatar, 'data:image/png;base64,x');
    assert.equal(data.created_at, 1000);
    assert.ok(Array.isArray(data.badges));
    assert.equal(data.rank, null); // mock DB reports zero points
    assert.equal(data.roomRank, null);
    // No private fields ever leak through the public endpoint.
    assert.ok(!('id' in data));
    assert.ok(!('role' in data));
    assert.ok(!('is_public' in data));
    assert.ok(!('roomAttempts' in data));
  });
});

// ─── /api/announcements ─────────────────────────────────────────────────────────

describe('GET /api/announcements', () => {
  test('should require a session', async () => {
    const res = await worker.fetch(
      new Request('https://example.com/api/announcements'),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 401);
  });

  test('should reject guests (excluded from member-only content)', async () => {
    const cookie = await sessionCookieFor({ sub: 9, username: 'guest-abc', role: 'guest' });
    const res = await worker.fetch(
      new Request('https://example.com/api/announcements', { headers: { Cookie: cookie } }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 403);
  });

  for (const role of ['member', 'instructor', 'admin']) {
    test(`should return the announcement list for a ${role}`, async () => {
      const cookie = await sessionCookieFor({ sub: 1, username: 'alice', role });
      const res = await worker.fetch(
        new Request('https://example.com/api/announcements', { headers: { Cookie: cookie } }),
        { JWT_SECRET: SECRET, DB: mockDB() },
      );
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.results));
    });
  }
});

describe('POST /api/announcements', () => {
  const post = (body, cookie) => worker.fetch(
    new Request('https://example.com/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
      body: JSON.stringify(body),
    }),
    { JWT_SECRET: SECRET, DB: mockDB() },
  );

  for (const role of ['member', 'instructor']) {
    test(`should reject a ${role} (admin-only)`, async () => {
      const cookie = await sessionCookieFor({ sub: 1, username: 'alice', role });
      const res = await post({ title: 'Hi', body: 'Body' }, cookie);
      assert.equal(res.status, 403);
    });
  }

  test('should reject an empty title or body', async () => {
    const cookie = await sessionCookieFor({ sub: 1, username: 'admin1', role: 'admin' });
    const res1 = await post({ title: '', body: 'Body' }, cookie);
    assert.equal(res1.status, 400);
    const res2 = await post({ title: 'Title', body: '  ' }, cookie);
    assert.equal(res2.status, 400);
  });

  test('should create the announcement for an admin', async () => {
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 1, username: 'admin1', role: 'admin' });
    const res = await worker.fetch(
      new Request('https://example.com/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ title: 'New Semester', body: 'Welcome back!' }),
      }),
      { JWT_SECRET: SECRET, DB: db },
    );
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.title, 'New Semester');
    const insert = db.calls.find(c => c.op === 'run');
    assert.match(insert.sql, /INSERT INTO announcements/);
    assert.deepEqual(insert.bindings, ['New Semester', 'Welcome back!', 1, data.created_at]);
  });
});

describe('PATCH /api/announcements/:id', () => {
  test('should reject a non-admin', async () => {
    const cookie = await sessionCookieFor({ sub: 2, username: 'inst', role: 'instructor' });
    const res = await worker.fetch(
      new Request('https://example.com/api/announcements/5', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ title: 'X', body: 'Y' }),
      }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 403);
  });

  test('should let any admin edit any announcement (no per-creator ownership check)', async () => {
    // Deliberately a *different* admin than whoever created id 5 — this
    // codebase treats announcements as shared unit-wide content, unlike Quiz
    // Rooms' creator-or-admin ownership pattern.
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 99, username: 'another-admin', role: 'admin' });
    const res = await worker.fetch(
      new Request('https://example.com/api/announcements/5', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ title: 'Updated Title', body: 'Updated body' }),
      }),
      { JWT_SECRET: SECRET, DB: db },
    );
    assert.equal(res.status, 200);
    const update = db.calls.find(c => c.op === 'run');
    assert.match(update.sql, /UPDATE announcements SET title = \?, body = \?, updated_at = \? WHERE id = \?/);
    assert.equal(update.bindings[0], 'Updated Title');
    assert.equal(update.bindings[3], '5');
  });
});

describe('DELETE /api/announcements/:id', () => {
  test('should reject a non-admin', async () => {
    const cookie = await sessionCookieFor({ sub: 2, username: 'member1', role: 'member' });
    const res = await worker.fetch(
      new Request('https://example.com/api/announcements/5', { method: 'DELETE', headers: { Cookie: cookie } }),
      { JWT_SECRET: SECRET, DB: mockDB() },
    );
    assert.equal(res.status, 403);
  });

  test('should delete for an admin', async () => {
    const db = mockDB();
    const cookie = await sessionCookieFor({ sub: 1, username: 'admin1', role: 'admin' });
    const res = await worker.fetch(
      new Request('https://example.com/api/announcements/5', { method: 'DELETE', headers: { Cookie: cookie } }),
      { JWT_SECRET: SECRET, DB: db },
    );
    assert.equal(res.status, 200);
    const del = db.calls.find(c => c.op === 'run');
    assert.match(del.sql, /DELETE FROM announcements WHERE id = \?/);
  });
});

// ─── Page rendering (served through env.ASSETS, backed by real public/*.html) ──
// These exercise the actual SSR injection paths in worker.js — the class of bug
// that shipped silently before (an unknown /topic/:id serving a 200 "soft 404",
// and topic pages shipping only a client-rendered "Loading topic..." shell).

describe('Static/simple pages', () => {
  const pages = ['/', '/start', '/about', '/resources', '/profile', '/admin', '/instructor', '/quiz', '/leaderboard', '/announcements'];

  for (const path of pages) {
    test(`GET ${path} should render 200 HTML with no leftover template placeholders`, async () => {
      const res = await worker.fetch(new Request(`https://example.com${path}`), { ASSETS: mockAssets() });
      assert.equal(res.status, 200);
      assert.match(res.headers.get('Content-Type'), /text\/html/);
      const body = await res.text();
      assert.ok(body.length > 0);
      assert.doesNotMatch(body, /\{\{.*\}\}/); // no unreplaced template tokens
    });
  }

  test('GET / should server-render every topic card (not depend on client JS)', async () => {
    const res = await worker.fetch(new Request('https://example.com/'), { ASSETS: mockAssets() });
    const body = await res.text();
    for (const t of topics) {
      assert.ok(body.includes(`/topic/${t.id}`), `homepage links to topic ${t.id}`);
    }
  });

  test('GET /start should server-render every pathway stage topic', async () => {
    const res = await worker.fetch(new Request('https://example.com/start'), { ASSETS: mockAssets() });
    const body = await res.text();
    for (const stage of pathwayStages) {
      for (const id of stage.topicIds) {
        assert.ok(body.includes(`/topic/${id}`), `pathway links to topic ${id}`);
      }
    }
  });
});

describe('GET /topic/:id', () => {
  for (const t of topics) {
    test(`topic ${t.id} (${t.title}) should render its real lesson content, not the loading placeholder`, async () => {
      const res = await worker.fetch(new Request(`https://example.com/topic/${t.id}`), { ASSETS: mockAssets() });
      assert.equal(res.status, 200);
      const body = await res.text();

      // The bug this guards against: every topic page serving identical thin
      // content because the real body only ever got filled in client-side.
      assert.doesNotMatch(body, /Loading topic\.\.\./);
      assert.doesNotMatch(body, />Loading\.\.\.</);

      // Real, topic-specific content made it into the initial HTML.
      assert.ok(body.includes(escapeHtml(t.title)), 'title rendered');
      for (const section of t.fullContent.sections) {
        assert.ok(body.includes(section.heading), `section heading "${section.heading}" rendered`);
      }

      // SEO tags from topicMetaTags().
      assert.ok(body.includes(`https://ungcyberunit.org/topic/${t.id}`), 'canonical URL present');
    });
  }

  test('should 404 for an unknown topic id (not a soft 404)', async () => {
    const res = await worker.fetch(new Request('https://example.com/topic/zz'), { ASSETS: mockAssets() });
    assert.equal(res.status, 404);
    const body = await res.text();
    assert.match(body, /404/);
  });
});

describe('GET /quiz/:code (quiz room shell)', () => {
  test('should render the quiz room shell for a well-formed room code', async () => {
    const res = await worker.fetch(new Request('https://example.com/quiz/ABCD-2345'), { ASSETS: mockAssets() });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('Content-Type'), /text\/html/);
  });
});

describe('GET /u/:username (public profile shell)', () => {
  test('should render the noindex profile shell for a well-formed username', async () => {
    const res = await worker.fetch(new Request('https://example.com/u/alice'), { ASSETS: mockAssets() });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('Content-Type'), /text\/html/);
    const body = await res.text();
    assert.match(body, /<meta name="robots" content="noindex">/);
  });
});

describe('GET /sop (SOP PDF via the canonical route)', () => {
  test('should serve the PDF with the right content type', async () => {
    const res = await worker.fetch(new Request('https://example.com/sop'), { ASSETS: mockAssets() });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('Content-Type'), /application\/pdf/);
  });
});

describe('Unknown routes', () => {
  test('should 404 for a nonsense path', async () => {
    const res = await worker.fetch(new Request('https://example.com/this-page-does-not-exist'), { ASSETS: mockAssets() });
    assert.equal(res.status, 404);
  });
});
