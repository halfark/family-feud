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

  // --- Otázky (dvojjazyčně, idempotentně po dvojici title+language) --------
  const EN = require('./seed-en');
  const exists = db.prepare('SELECT id FROM sets WHERE title = ? AND language = ?');
  const insert = db.prepare(`INSERT INTO sets
    (title, topic, grade, language, data_json, author_id, author_name,
     status, visibility, play_count, created_at, reviewed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'approved', 'public', 0, ?, ?)`);

  let added = { cs: 0, en: 0 };
  const tx = db.transaction(() => {
    for (const [lang, list] of [['cs', SEED_SETS_CS], ['en', EN]]) {
      for (const s of list) {
        if (exists.get(s.title, lang)) continue;
        insert.run(s.title, s.topic, s.grade, lang,
          JSON.stringify({ questions: s.questions }),
          admin.id, admin.display_name, now, now);
        added[lang]++;
      }
    }
  });
  tx();

  const tot = db.prepare('SELECT language, COUNT(*) c FROM sets GROUP BY language').all();
  if (added.cs || added.en) {
    console.log(`\u2713 Přidáno: ${added.cs} českých, ${added.en} anglických sad.`);
  } else {
    console.log('• Všechny výchozí sady už v databázi jsou.');
  }
  console.log('  Stav DB:', tot.map(r => `${r.language}=${r.c}`).join(', '));
}

seed();
module.exports = { SEED_SETS_CS };
