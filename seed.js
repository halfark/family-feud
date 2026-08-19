const db = require('./db');
const bcrypt = require('bcryptjs');

// ---- ČESKÁ databáze otázek („5 proti 5") ------------------------------------
// grade: "1.–3. třída" | "4.–5. třída" | "6.–9. třída"
const SEED_SETS_CS = require('./seed-cs');

function seed() {
  const now = Date.now();

  // --- Admin účet -----------------------------------------------------------
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@skola.cz').toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    const hash = bcrypt.hashSync(adminPass, 10);
    db.prepare(`INSERT INTO users (email, password_hash, display_name, is_admin, verified, created_at)
                VALUES (?, ?, ?, 1, 1, ?)`).run(adminEmail, hash, 'Administrátor', now);
    console.log(`✓ Admin vytvořen: ${adminEmail} / ${adminPass}  (změň heslo přes ADMIN_PASSWORD!)`);
  } else {
    console.log(`• Admin už existuje: ${adminEmail}`);
  }
  const admin = db.prepare('SELECT id, display_name FROM users WHERE email = ?').get(adminEmail);

  // --- Výchozí sady ---------------------------------------------------------
  // Sady dodávané se seedem se poznají podle builtin_key ("cs:Název").
  // Při opakovaném běhu se jejich OBSAH aktualizuje, ale zachová se:
  //   • hodnocení a komentáře (leží v jiné tabulce, klíčované přes set_id)
  //   • počet odehraných her (play_count i tabulka plays)
  //   • rozhodnutí admina o viditelnosti a stavu
  // Sad vytvořených uživateli se skript nikdy nedotkne.
  const EN = require('./seed-en');

  const byKey    = db.prepare('SELECT * FROM sets WHERE builtin_key = ?');
  const legacy   = db.prepare(`SELECT * FROM sets
                               WHERE builtin_key IS NULL AND title = ? AND language = ?
                                 AND author_id = ?`);
  const adopt    = db.prepare('UPDATE sets SET builtin_key = ? WHERE id = ?');
  const update   = db.prepare(`UPDATE sets
                               SET topic = ?, grade = ?, data_json = ? WHERE id = ?`);
  const insert   = db.prepare(`INSERT INTO sets
    (title, topic, grade, language, data_json, author_id, author_name,
     status, visibility, play_count, created_at, reviewed_at, builtin_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'approved', 'public', 0, ?, ?, ?)`);

  const stat = { added: 0, updated: 0, same: 0, adopted: 0 };

  const tx = db.transaction(() => {
    for (const [lang, list] of [['cs', SEED_SETS_CS], ['en', EN]]) {
      for (const s of list) {
        const key = `${lang}:${s.title}`;
        const json = JSON.stringify({ questions: s.questions });

        let row = byKey.get(key);

        // Sada z dřívější verze, která ještě klíč nemá → převezmeme ji.
        if (!row) {
          const old = legacy.get(s.title, lang, admin.id);
          if (old) { adopt.run(key, old.id); row = byKey.get(key); stat.adopted++; }
        }

        if (!row) {
          insert.run(s.title, s.topic, s.grade, lang, json,
            admin.id, admin.display_name, now, now, key);
          stat.added++;
        } else if (row.data_json !== json || row.topic !== s.topic || row.grade !== s.grade) {
          update.run(s.topic, s.grade, json, row.id);
          stat.updated++;
        } else {
          stat.same++;
        }
      }
    }
  });
  tx();

  const tot = db.prepare('SELECT language, COUNT(*) c FROM sets GROUP BY language').all();
  const parts = [];
  if (stat.added)   parts.push(`${stat.added} přidáno`);
  if (stat.updated) parts.push(`${stat.updated} aktualizováno`);
  if (stat.adopted) parts.push(`${stat.adopted} převzato z dřívější verze`);
  if (stat.same)    parts.push(`${stat.same} beze změny`);
  console.log(`\u2713 Výchozí sady: ${parts.join(', ')}.`);

  const userSets = db.prepare('SELECT COUNT(*) c FROM sets WHERE builtin_key IS NULL').get().c;
  const ratings  = db.prepare('SELECT COUNT(*) c FROM ratings').get().c;
  const plays    = db.prepare('SELECT COUNT(*) c FROM plays').get().c;
  console.log('  Stav DB:', tot.map(r => `${r.language}=${r.c}`).join(', '),
    `| uživatelských sad: ${userSets} | hodnocení: ${ratings} | odehráno: ${plays}`);
}

seed();
module.exports = { SEED_SETS_CS };
