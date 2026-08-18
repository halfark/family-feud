const db = require('./db');
const bcrypt = require('bcryptjs');

// ---- ČESKÁ databáze otázek („5 proti 5") ------------------------------------
// grade: "1.–3. třída" | "4.–5. třída" | "6.–9. třída"
const SEED_SETS_CS = [
  { title: "Zvířata kolem nás", topic: "Přírodověda", grade: "1.–3. třída", questions: [
    { question: "Jmenuj domácí zvíře.", answers: [
      {text:"Pes",points:40},{text:"Kočka",points:32},{text:"Králík",points:10},{text:"Křeček",points:8},{text:"Papoušek",points:6},{text:"Rybička",points:4}] },
    { question: "Které zvíře žije v lese?", answers: [
      {text:"Liška",points:28},{text:"Jelen",points:24},{text:"Zajíc",points:18},{text:"Veverka",points:14},{text:"Divočák",points:10},{text:"Medvěd",points:6}] },
    { question: "Jmenuj zvíře ze ZOO.", answers: [
      {text:"Lev",points:30},{text:"Slon",points:26},{text:"Žirafa",points:20},{text:"Opice",points:12},{text:"Tygr",points:8},{text:"Zebra",points:4}] },
  ]},
  { title: "Ptáci a hmyz", topic: "Přírodověda", grade: "4.–5. třída", questions: [
    { question: "Jmenuj hmyz.", answers: [
      {text:"Mravenec",points:26},{text:"Včela",points:24},{text:"Motýl",points:20},{text:"Moucha",points:14},{text:"Beruška",points:10},{text:"Komár",points:6}] },
    { question: "Jmenuj ptáka.", answers: [
      {text:"Vrabec",points:24},{text:"Sýkorka",points:20},{text:"Kos",points:16},{text:"Vlaštovka",points:14},{text:"Sova",points:14},{text:"Čáp",points:12}] },
    { question: "Co dělají zvířata v zimě?", answers: [
      {text:"Spí / hibernují",points:34},{text:"Odlétají do teplých krajin",points:26},{text:"Shánějí zásoby",points:20},{text:"Narostne jim hustší srst",points:12},{text:"Stěhují se",points:8}] },
  ]},
  { title: "Ve škole", topic: "Škola", grade: "1.–3. třída", questions: [
    { question: "Co máš v penálu?", answers: [
      {text:"Tužka",points:30},{text:"Pero",points:24},{text:"Guma",points:18},{text:"Pastelky",points:14},{text:"Ořezávátko",points:8},{text:"Pravítko",points:6}] },
    { question: "Jmenuj školní předmět.", answers: [
      {text:"Matematika",points:26},{text:"Čeština",points:24},{text:"Tělocvik",points:20},{text:"Prvouka",points:12},{text:"Výtvarka",points:10},{text:"Hudebka",points:8}] },
  ]},
  { title: "Škola a učení", topic: "Škola", grade: "6.–9. třída", questions: [
    { question: "Který předmět mají žáci nejraději?", answers: [
      {text:"Tělocvik",points:30},{text:"Informatika",points:22},{text:"Výtvarná výchova",points:16},{text:"Dějepis",points:12},{text:"Matematika",points:12},{text:"Chemie",points:8}] },
    { question: "Co potřebuješ na hodinu výtvarky?", answers: [
      {text:"Štětec",points:26},{text:"Barvy",points:24},{text:"Papír",points:18},{text:"Voda",points:14},{text:"Pastelky",points:10},{text:"Nůžky",points:8}] },
  ]},
  { title: "Ovoce, zelenina a jídlo", topic: "Jídlo a zdraví", grade: "1.–3. třída", questions: [
    { question: "Jmenuj ovoce.", answers: [
      {text:"Jablko",points:34},{text:"Banán",points:26},{text:"Hruška",points:16},{text:"Pomeranč",points:12},{text:"Jahoda",points:8},{text:"Švestka",points:4}] },
    { question: "Jmenuj zeleninu.", answers: [
      {text:"Mrkev",points:30},{text:"Rajče",points:24},{text:"Okurka",points:18},{text:"Brambora",points:14},{text:"Paprika",points:8},{text:"Cibule",points:6}] },
    { question: "Co jíš k snídani?", answers: [
      {text:"Rohlík / pečivo",points:28},{text:"Cereálie",points:22},{text:"Chléb",points:18},{text:"Jogurt",points:14},{text:"Vejce",points:10},{text:"Palačinky",points:8}] },
  ]},
  { title: "Zdravý životní styl", topic: "Jídlo a zdraví", grade: "4.–5. třída", questions: [
    { question: "Co patří ke zdravému životu?", answers: [
      {text:"Pohyb a sport",points:32},{text:"Ovoce a zelenina",points:26},{text:"Dostatek spánku",points:18},{text:"Pitný režim",points:14},{text:"Nekouřit",points:10}] },
    { question: "Jmenuj zdravý nápoj.", answers: [
      {text:"Voda",points:34},{text:"Ovocný džus",points:24},{text:"Čaj",points:16},{text:"Mléko",points:14},{text:"Kakao",points:8},{text:"Smoothie",points:4}] },
  ]},
  { title: "Sport a pohyb", topic: "Sport", grade: "4.–5. třída", questions: [
    { question: "Jmenuj míčový sport.", answers: [
      {text:"Fotbal",points:36},{text:"Basketbal",points:22},{text:"Volejbal",points:16},{text:"Házená",points:12},{text:"Tenis",points:8},{text:"Ragby",points:6}] },
    { question: "Co si vezmeš na lyže?", answers: [
      {text:"Lyže",points:30},{text:"Hůlky",points:24},{text:"Přilba",points:18},{text:"Rukavice",points:14},{text:"Brýle",points:8},{text:"Bunda",points:6}] },
  ]},
  { title: "Doprava a bezpečí", topic: "Dopravní výchova", grade: "1.–3. třída", questions: [
    { question: "Jmenuj dopravní prostředek.", answers: [
      {text:"Auto",points:30},{text:"Autobus",points:22},{text:"Vlak",points:18},{text:"Kolo",points:12},{text:"Letadlo",points:10},{text:"Loď",points:8}] },
    { question: "Co má na sobě cyklista pro bezpečí?", answers: [
      {text:"Přilba",points:40},{text:"Reflexní prvky",points:28},{text:"Světla na kole",points:16},{text:"Rukavice",points:10},{text:"Chrániče",points:6}] },
  ]},
  { title: "Povolání", topic: "Člověk a společnost", grade: "4.–5. třída", questions: [
    { question: "Jmenuj povolání.", answers: [
      {text:"Lékař",points:24},{text:"Učitel",points:22},{text:"Hasič",points:18},{text:"Policista",points:16},{text:"Kuchař",points:12},{text:"Řidič",points:8}] },
    { question: "Kdo pracuje v nemocnici?", answers: [
      {text:"Lékař",points:34},{text:"Zdravotní sestra",points:28},{text:"Sanitář",points:14},{text:"Lékárník",points:10},{text:"Uklízečka",points:8},{text:"Řidič sanitky",points:6}] },
  ]},
  { title: "Naše vlast – Česko", topic: "Vlastivěda / Zeměpis", grade: "6.–9. třída", questions: [
    { question: "Jmenuj české město.", answers: [
      {text:"Praha",points:34},{text:"Brno",points:24},{text:"Ostrava",points:16},{text:"Plzeň",points:10},{text:"Olomouc",points:8},{text:"Liberec",points:8}] },
    { question: "Jmenuj českou řeku.", answers: [
      {text:"Vltava",points:34},{text:"Labe",points:28},{text:"Morava",points:16},{text:"Odra",points:10},{text:"Ohře",points:8},{text:"Sázava",points:4}] },
    { question: "Jmenuj české pohoří.", answers: [
      {text:"Krkonoše",points:30},{text:"Šumava",points:24},{text:"Jeseníky",points:18},{text:"Beskydy",points:16},{text:"Orlické hory",points:8},{text:"Krušné hory",points:4}] },
  ]},
  { title: "Vesmír", topic: "Přírodní vědy", grade: "6.–9. třída", questions: [
    { question: "Jmenuj planetu sluneční soustavy.", answers: [
      {text:"Země",points:24},{text:"Mars",points:22},{text:"Jupiter",points:16},{text:"Saturn",points:14},{text:"Venuše",points:14},{text:"Merkur",points:10}] },
    { question: "Co vidíš na noční obloze?", answers: [
      {text:"Hvězdy",points:34},{text:"Měsíc",points:30},{text:"Planety",points:14},{text:"Kometa",points:12},{text:"Družice",points:10}] },
  ]},
  { title: "Lidské tělo", topic: "Přírodověda", grade: "4.–5. třída", questions: [
    { question: "Jmenuj část lidského těla.", answers: [
      {text:"Ruka",points:24},{text:"Noha",points:22},{text:"Hlava",points:18},{text:"Oko",points:14},{text:"Ucho",points:12},{text:"Nos",points:10}] },
    { question: "Které máme smysly?", answers: [
      {text:"Zrak",points:26},{text:"Sluch",points:24},{text:"Čich",points:20},{text:"Chuť",points:18},{text:"Hmat",points:12}] },
  ]},
  { title: "Roční období a svátky", topic: "Prvouka", grade: "1.–3. třída", questions: [
    { question: "Jmenuj roční období.", answers: [
      {text:"Léto",points:30},{text:"Zima",points:28},{text:"Jaro",points:22},{text:"Podzim",points:20}] },
    { question: "Co děláme v zimě?", answers: [
      {text:"Sáňkujeme",points:26},{text:"Stavíme sněhuláka",points:24},{text:"Lyžujeme",points:20},{text:"Bruslíme",points:16},{text:"Koulujeme se",points:14}] },
    { question: "Jaké známe svátky?", answers: [
      {text:"Vánoce",points:34},{text:"Velikonoce",points:28},{text:"Mikuláš",points:16},{text:"Silvestr",points:12},{text:"Den dětí",points:10}] },
  ]},
  { title: "Stromy a rostliny", topic: "Přírodověda", grade: "4.–5. třída", questions: [
    { question: "Jmenuj listnatý strom.", answers: [
      {text:"Dub",points:26},{text:"Buk",points:22},{text:"Bříza",points:18},{text:"Lípa",points:16},{text:"Javor",points:10},{text:"Kaštan",points:8}] },
    { question: "Jmenuj jehličnatý strom.", answers: [
      {text:"Smrk",points:30},{text:"Borovice",points:26},{text:"Jedle",points:18},{text:"Modřín",points:14},{text:"Túje",points:8},{text:"Tis",points:4}] },
  ]},
  { title: "Čeština – slovní druhy", topic: "Český jazyk", grade: "6.–9. třída", questions: [
    { question: "Jmenuj slovní druh.", answers: [
      {text:"Podstatné jméno",points:24},{text:"Sloveso",points:22},{text:"Přídavné jméno",points:18},{text:"Zájmeno",points:14},{text:"Číslovka",points:12},{text:"Příslovce",points:10}] },
    { question: "Jmenuj vyjmenované slovo po B.", answers: [
      {text:"Bydlet",points:24},{text:"Být",points:22},{text:"Byt",points:18},{text:"Obyvatel",points:14},{text:"Nábytek",points:12},{text:"Babyka",points:10}] },
  ]},
];

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
