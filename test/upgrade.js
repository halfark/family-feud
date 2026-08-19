/**
 * Ověří, že opakovaný `node seed.js` aktualizuje výchozí sady, ale nesmaže
 * uživatelská data — simuluje upgrade nasazené instance.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'feud-upg-'));
const env = { ...process.env, DATA_DIR, ADMIN_EMAIL: 'admin@test.cz', ADMIN_PASSWORD: 'x' };
const ROOT = __dirname + '/..';

let pass = 0, fail = 0;
const check = (c, m) => c ? (pass++, console.log('  \u2713 ' + m)) : (fail++, console.log('  \u2717 ' + m));

function seed() { return execFileSync('node', ['seed.js'], { cwd: ROOT, env, encoding: 'utf8' }); }
function open() {
  delete require.cache[require.resolve(ROOT + '/db.js')];
  process.env.DATA_DIR = DATA_DIR;
  return require(ROOT + '/db.js');
}

console.log('\n=== 1. První instalace ===');
console.log(seed().trim().split('\n').map(l => '    ' + l).join('\n'));
let db = open();

const builtin = db.prepare('SELECT COUNT(*) c FROM sets WHERE builtin_key IS NOT NULL').get().c;
check(builtin === 40, `${builtin} výchozích sad má builtin_key`);

console.log('\n=== 2. Simulace provozu (uživatel, sada, hodnocení, hry) ===');
const now = Date.now();
db.prepare(`INSERT INTO users (email, password_hash, display_name, is_admin, verified, created_at)
            VALUES (?,?,?,0,1,?)`).run('ucitel@zs.cz', bcrypt.hashSync('heslo1234', 10), 'Učitel', now);
const uid = db.prepare('SELECT id FROM users WHERE email = ?').get('ucitel@zs.cz').id;

db.prepare(`INSERT INTO sets (title, topic, grade, language, data_json, author_id, author_name,
            status, visibility, play_count, created_at) VALUES (?,?,?,?,?,?,?,'approved','public',7,?)`)
  .run('Moje vlastní sada', 'Test', '4.–5. třída', 'cs',
       JSON.stringify({ questions: [{ question: 'Vlastní otázka?', answers: [
         { text: 'Ano', points: 60 }, { text: 'Ne', points: 40 }] }] }),
       uid, 'Učitel', now);

const target = db.prepare("SELECT id FROM sets WHERE builtin_key = 'cs:Vesmír'").get().id;
db.prepare('UPDATE sets SET play_count = 42 WHERE id = ?').run(target);
db.prepare('INSERT INTO plays (set_id, played_at) VALUES (?,?)').run(target, now);
db.prepare(`INSERT INTO ratings (set_id, user_id, stars, comment, created_at)
            VALUES (?,?,?,?,?)`).run(target, uid, 5, 'Skvělé do 8. třídy.', now);
// admin schválně přepne jednu výchozí sadu na soukromou
db.prepare("UPDATE sets SET visibility='private' WHERE builtin_key = 'en:Animals'").run();
console.log('    vloženo: 1 uživatel, 1 vlastní sada, 1 hodnocení, 42 her, 1 změna viditelnosti');

// zestárnutí obsahu, aby se projevila aktualizace
db.prepare("UPDATE sets SET data_json = ? WHERE builtin_key = 'cs:Vesmír'")
  .run(JSON.stringify({ questions: [{ question: 'Stará otázka?', answers: [
    { text: 'A', points: 50 }, { text: 'B', points: 50 }] }] }));

// a jedna sada z „dřívější verze“ bez klíče, kterou má seed převzít
db.prepare("UPDATE sets SET builtin_key = NULL WHERE builtin_key = 'cs:Povolání'").run();

console.log('\n=== 3. Redeploy: node seed.js nad existující databází ===');
const out = seed();
console.log(out.trim().split('\n').map(l => '    ' + l).join('\n'));
db = open();

console.log('\n=== 4. Kontrola po upgradu ===');
check(db.prepare('SELECT COUNT(*) c FROM users').get().c === 2, 'uživatelé zůstali');
check(!!db.prepare("SELECT id FROM sets WHERE title = 'Moje vlastní sada'").get(),
  'uživatelská sada zůstala');
check(db.prepare("SELECT play_count p FROM sets WHERE title='Moje vlastní sada'").get().p === 7,
  'počet her u uživatelské sady zůstal');

const v = db.prepare("SELECT * FROM sets WHERE builtin_key = 'cs:Vesmír'").get();
check(JSON.parse(v.data_json).questions.length === 10, 'zastaralá výchozí sada má nově 10 otázek');
check(v.play_count === 42, 'počet odehraných her u aktualizované sady zůstal (42)');
check(db.prepare('SELECT COUNT(*) c FROM ratings WHERE set_id = ?').get(v.id).c === 1,
  'hodnocení u aktualizované sady zůstalo');
check(db.prepare('SELECT COUNT(*) c FROM plays').get().c === 1, 'záznamy v plays zůstaly');

check(db.prepare("SELECT visibility v FROM sets WHERE builtin_key='en:Animals'").get().v === 'private',
  'admin nastavená viditelnost se nepřepsala');
check(!!db.prepare("SELECT id FROM sets WHERE builtin_key = 'cs:Povolání'").get(),
  'sada z dřívější verze byla převzata, ne zduplikována');
check(db.prepare("SELECT COUNT(*) c FROM sets WHERE title='Povolání'").get().c === 1,
  'nevznikl duplikát sady Povolání');

const counts = db.prepare(`SELECT language, COUNT(*) c FROM sets
                           WHERE builtin_key IS NOT NULL GROUP BY language`).all();
check(counts.find(r => r.language === 'cs')?.c === 15 &&
      counts.find(r => r.language === 'en')?.c === 25, 'stále 15 cs + 25 en výchozích sad');

const totalQ = db.prepare(`SELECT SUM((SELECT COUNT(*) FROM json_each(json_extract(data_json,'$.questions')))) n
                           FROM sets WHERE builtin_key IS NOT NULL`).get().n;
check(totalQ === 400, `výchozí sady mají celkem ${totalQ} otázek`);

console.log('\n=== 5. Třetí běh je bez změn ===');
const out3 = seed();
check(/beze změny/.test(out3) && !/aktualizováno/.test(out3), 'opakovaný seed už nic nemění');

fs.rmSync(DATA_DIR, { recursive: true, force: true });
console.log(`\n${'\u2500'.repeat(46)}`);
console.log(`  Prošlo: ${pass}   Selhalo: ${fail}`);
console.log('\u2500'.repeat(46));
process.exit(fail ? 1 : 0);
