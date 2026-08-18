const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Data adresář je konfigurovatelný přes DATA_DIR (v Dockeru bind-mountuj hostitelský adresář!)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'feud.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  verified      INTEGER NOT NULL DEFAULT 0,
  verify_token  TEXT,
  verify_expires INTEGER,
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sets (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  topic         TEXT NOT NULL,
  grade         TEXT NOT NULL,
  data_json     TEXT NOT NULL,
  language      TEXT NOT NULL DEFAULT 'cs',        -- cs | en
  author_id     INTEGER,
  author_name   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',   -- pending | approved | rejected
  visibility    TEXT NOT NULL DEFAULT 'private',    -- public | private
  play_count    INTEGER NOT NULL DEFAULT 0,
  reject_reason TEXT,
  created_at    INTEGER NOT NULL,
  reviewed_at   INTEGER,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ratings (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  set_id     INTEGER NOT NULL,
  user_id    INTEGER NOT NULL,
  stars      INTEGER NOT NULL,
  comment    TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE (set_id, user_id),
  FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plays (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  set_id    INTEGER NOT NULL,
  played_at INTEGER NOT NULL,
  FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sets_status ON sets(status, visibility);
CREATE INDEX IF NOT EXISTS idx_ratings_set ON ratings(set_id);
CREATE INDEX IF NOT EXISTS idx_plays_set ON plays(set_id);
`);

// --- Migrace pro databáze vytvořené před přidáním dvojjazyčnosti -------------
const cols = db.prepare(`PRAGMA table_info(sets)`).all().map(c => c.name);
if (!cols.includes('language')) {
  db.exec(`ALTER TABLE sets ADD COLUMN language TEXT NOT NULL DEFAULT 'cs'`);
  console.log('✓ Migrace: přidán sloupec sets.language (výchozí "cs")');
}
db.exec(`CREATE INDEX IF NOT EXISTS idx_sets_lang ON sets(language, status, visibility)`);

module.exports = db;
