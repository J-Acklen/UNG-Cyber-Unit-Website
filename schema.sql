CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    UNIQUE NOT NULL,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'member',
  avatar        TEXT,
  streak        INTEGER NOT NULL DEFAULT 0,
  last_active   TEXT,
  created_at    INTEGER NOT NULL,
  is_public     INTEGER NOT NULL DEFAULT 0,
  last_seen_announcements INTEGER
);

CREATE TABLE IF NOT EXISTS quiz_results (
  user_id    INTEGER NOT NULL,
  topic_id   TEXT    NOT NULL,
  score      INTEGER NOT NULL,
  total      INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quiz_rooms (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  code        TEXT    UNIQUE NOT NULL,
  title       TEXT    NOT NULL,
  created_by  INTEGER NOT NULL,
  expires_at  INTEGER,
  status      TEXT    NOT NULL DEFAULT 'open',
  visibility  TEXT    NOT NULL DEFAULT 'private',
  created_at  INTEGER NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quiz_room_questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id     INTEGER NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  type        TEXT    NOT NULL DEFAULT 'multiple_choice',
  question    TEXT    NOT NULL,
  answers     TEXT    NOT NULL,
  correct     INTEGER,
  explanation TEXT    NOT NULL DEFAULT '',
  FOREIGN KEY (room_id) REFERENCES quiz_rooms(id)
);

CREATE TABLE IF NOT EXISTS quiz_room_attempts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id      INTEGER NOT NULL,
  user_id      INTEGER NOT NULL,
  score        INTEGER NOT NULL,
  total        INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  UNIQUE (room_id, user_id),
  FOREIGN KEY (room_id) REFERENCES quiz_rooms(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sliding-window brute-force protection: one row per failed room-code lookup.
CREATE TABLE IF NOT EXISTS room_lookup_failures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT    NOT NULL,
  ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rlf_ip_ts ON room_lookup_failures (ip, ts);

CREATE TABLE IF NOT EXISTS quiz_room_answers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id    INTEGER NOT NULL,
  question_id   INTEGER NOT NULL,
  selected      INTEGER,
  response_text TEXT,
  is_correct    INTEGER,
  FOREIGN KEY (attempt_id)  REFERENCES quiz_room_attempts(id),
  FOREIGN KEY (question_id) REFERENCES quiz_room_questions(id)
);

CREATE TABLE IF NOT EXISTS announcements (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  body        TEXT    NOT NULL,
  created_by  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  message     TEXT    NOT NULL,
  username    TEXT,
  created_at  INTEGER NOT NULL
);

-- Sliding-window rate limit for the open (unauthenticated) feedback form:
-- one row per submission, same shape as room_lookup_failures.
CREATE TABLE IF NOT EXISTS feedback_rate_limit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT    NOT NULL,
  ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_frl_ip_ts ON feedback_rate_limit (ip, ts);
