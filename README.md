# 5 proti 5 / Family Feud — výuková soutěž pro ZŠ

[![CI](https://github.com/halfark/family-feud/actions/workflows/ci.yml/badge.svg)](https://github.com/halfark/family-feud/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![Node](https://img.shields.io/badge/node-%E2%89%A520-brightgreen)

Dvojjazyčná webová aplikace ve stylu Family Feud pro použití ve třídě. Běží ve **dvou oknech**:
okno moderátora (učitel) a okno pro žáky (projektor). Obsahuje databázi otázek pro ZŠ,
hodnocení sad, statistiky odehraných her a moderovaný příspěvkový systém pro hosty.

---

## Rozcestník

Na úvodní stránce `/` si uživatel vybere verzi:

| Verze | Obsah |
|---|---|
| 🇨🇿 **5 proti 5** | česká verze, 1.–9. třída — prvouka, přírodověda, vlastivěda, čeština… |
| 🇬🇧 **Family Feud** | anglická ESL verze, 3.–9. třída (A1–B1) — slovní zásoba, konverzace, reálie |

Volba se pamatuje v prohlížeči; jazyk lze kdykoli přepnout tlačítkem 🇨🇿/🇬🇧 v horní liště.
Přepnutí mění **celé rozhraní** (menu, panel moderátora, tabule pro žáky, admin, hlášky)
i **nabídku sad** — česká a anglická databáze jsou oddělené a nemíchají se.
Okno pro žáky přebírá jazyk od moderátora automaticky.

---

## Dvě okna

| Okno | Adresa | Kdo to vidí |
|---|---|---|
| Rozcestník | `/` | volba jazyka / verze |
| Katalog | `/catalog.html` | přehled sad pro zvolený jazyk |
| Moderátor | `/host.html` | jen učitel — vidí odpovědi i body dopředu |
| Žáci | `/display.html` | projektor — velká tabule, odpovědi skryté |

Okna se propojí automaticky přes `BroadcastChannel` (stejný prohlížeč, stejný počítač).
V okně moderátora klikni na **„Otevřít okno pro žáky“**, okno přetáhni na projektor a dej `F11`.

> `BroadcastChannel` funguje mezi okny/záložkami **jednoho prohlížeče**. Pro dva různé
> počítače by bylo potřeba dopsat WebSocket relay — dej vědět, přidám.

### Klávesové zkratky moderátora

| Klávesa | Akce |
|---|---|
| `1`–`8` | odhalit / skrýt odpověď |
| `X` nebo `mezerník` | chyba (křížek) |
| `C` | smazat chyby |
| `Q` / `W` | přiřadit body kola týmu 1 / 2 |
| `N` / `P` | další / předchozí otázka |
| `R` | odhalit všechny odpovědi |
| `T` | přepnout, kdo je na tahu |
| `F` | zapnout/vypnout zvuk |

### Zvuk a znělky

Všechny zvuky se syntetizují přímo v prohlížeči přes WebAudio — projekt nemá
jediný zvukový soubor a nic se nestahuje. Engine (`public/audio.js`) staví
žesťový hlas z rozladěných pil, zvonkohru, bas, činel, bzučák a potlesk
z filtrovaného šumu, to celé přes kompresor a dozvuk.

| Událost | Zvuk |
|---|---|
| Úvodní obrazovka, tlačítko *Přehrát znělku* | `theme` — fanfára, ~3,4 s |
| První otázka v sadě | `roundStart` |
| Odhalení odpovědi | `reveal`, u odpovědi č. 1 slavnostnější `revealTop` |
| Chyba | `strike`, u třetí `strikeOut` |
| Připsání bodů kola | `score` — vzestupná fanfára a potlesk |
| Vyhlášení vítěze | `win` — velká fanfára s potleskem |

Hlasitost se řídí posuvníkem v panelu moderátora a přenáší se do okna žáků.
V okně žáků je potřeba jednou kliknout, aby prohlížeč povolil přehrávání
(autoplay policy) — vybízí k tomu blikající nápis na úvodní obrazovce.

> Znělky jsou **původní motivy** v žánru televizních soutěží. Nejde o přepis
> hudby z pořadu Family Feud ani jiné chráněné skladby.

### Návod pro učitele

Při prvním otevření panelu moderátora vyskočí návod v pěti krocích
(druhé okno → výběr sady → odhalování → chyby → připsání bodů), lokalizovaný
do obou jazyků. Dá se zavřít natrvalo zaškrtnutím *Příště nezobrazovat*
a kdykoli znovu otevřít tlačítkem **?** v hlavičce.

---

## Uživatelé a role

| Role | Co může |
|---|---|
| Nepřihlášený | prohlížet a hrát veřejné sady, vidět statistiky |
| Ověřený uživatel | + vytvářet sady (jdou ke schválení), hodnotit hvězdami a komentářem |
| Admin | + schvalovat/zamítat, přepínat veřejné↔soukromé, mazat, spravovat uživatele |

**Registrace vyžaduje CAPTCHA i ověření e-mailem.** CAPTCHA je serverová matematická úloha
podepsaná HMAC — správná odpověď se nikdy neposílá do prohlížeče, takže ji nejde odečíst z DOM.
Bez kliknutí na ověřovací odkaz se účet nepřihlásí.

### Moderace

Sada od běžného uživatele jde vždy do stavu `pending`. Admin ji v `/admin.html` může:

- **schválit veřejně** — uvidí ji všichni v katalogu,
- **schválit soukromě** — uvidí ji jen autor,
- **zamítnout s důvodem** — autor důvod vidí u své sady.

Editace už schválené sady ji vrací zpět ke schválení.

---

## Databáze otázek

Seed naplní obě jazykové větve: **40 sad / 400 otázek**, každá sada má přesně
10 otázek. Učitel si v panelu moderátora vybere, které z nich a v jakém pořadí
týmům položí — na hodinu obvykle stačí tři až pět. Použité otázky se v seznamu
odškrtnou ✓, takže se v nich neztratíš a příště můžeš pokračovat jinými.

### 🇨🇿 Česká — 15 sad, 150 otázek

| Ročník | Sad | Témata |
|---|---|---|
| 1.–3. třída | 5 | zvířata, škola, jídlo, dopravní výchova, roční období a svátky |
| 4.–5. třída | 6 | ptáci a hmyz, zdravý životní styl, sport, povolání, lidské tělo, rostliny |
| 6.–9. třída | 4 | škola a učení, Česko, vesmír, český jazyk |

### 🇬🇧 Anglická ESL — 25 sad, 250 otázek

| Úroveň | Sad | Témata |
|---|---|---|
| `Grade 3–5 (A1)` | 8 | barvy a tvary, zvířata, jídlo a pití, rodina, školní potřeby, tělo, oblečení, dny a měsíce |
| `Grade 6–7 (A1–A2)` | 8 | denní režim, volný čas, sport, bydlení, povolání, místa ve městě, počasí, svátky |
| `Grade 8–9 (A2–B1)` | 9 | cestování, technologie, životní prostředí, zdraví, nakupování, pocity a povaha, nepravidelná slovesa, anglicky mluvící země, škola a plány do budoucna |

Anglické sady jsou psané jako survey otázky („Name a pet.“, „What do you do in your
free time?“), takže procvičují produktivní slovní zásobu, ne jen pasivní rozpoznávání.

### Aktualizace sad bez ztráty dat

Výchozí sady jsou v databázi označené sloupcem `builtin_key` (např. `cs:Vesmír`).
Díky tomu je **`node seed.js` bezpečné pustit i nad běžící instalací** — v Coolify
se spouští automaticky při každém deployi:

- výchozí sadě se přepíše obsah, téma a ročník na aktuální verzi,
- **zůstanou** hodnocení, komentáře, počet odehraných her i to, jestli ji admin
  přepnul na soukromou,
- sad vytvořených uživateli se skript nedotkne vůbec,
- sady z dřívějších verzí, které klíč ještě nemají, se převezmou — nevznikne duplikát.

Databázi tedy pro aktualizaci obsahu není potřeba mazat. Chování ověřuje
`npm run test:upgrade`, který nasimuluje provoz (uživatel, vlastní sada, hodnocení,
42 odehraných her) a zkontroluje, že to redeploy přežije.

### Jak jsou sady zapsané

Kvůli přehlednosti používají `seed-cs.js` a `seed-en.js` kompaktní zápis — jedna
otázka na řádek, odpovědi jako `text:body`:

```js
set('Zvířata kolem nás', 'Přírodověda', '1.–3. třída',
  'Jmenuj domácí zvíře.|Pes:34|Kočka:28|Králík:14|Křeček:10',
  'Co nám dává kráva?|Mléko:52|Maso:24|Kůži:12|Hnůj:8',
  …)
```

Parser v `seed-util.js` zápis rozbalí a rovnou hlídá pravidla: minimálně 10 otázek
na sadu, 2–8 odpovědí na otázku, body 1–99. Když něco nesedí, seed spadne
s konkrétní chybou místo aby uložil rozbitou sadu.

### Import / export JSON

Na stránce `/create.html` lze sadu nahrát přetažením souboru:

```json
{
  "title": "Zvířata kolem nás",
  "topic": "Přírodověda",
  "grade": "1.–3. třída",
  "language": "cs",
  "questions": [
    { "question": "Jmenuj domácí zvíře.",
      "answers": [
        {"text": "Pes", "points": 40},
        {"text": "Kočka", "points": 32}
      ]}
  ]
}
```

Pravidla: 1–25 otázek na sadu, 2–8 odpovědí na otázku, body 1–99.
Odpovědi se automaticky seřadí sestupně podle bodů.
Pole `language` je `"cs"` nebo `"en"`; chybí-li nebo je neplatné, použije se `"cs"`.
Tlačítko *Stáhnout vzor* dá šablonu podle právě zvoleného jazyka sady.

---

## Statistiky

`/stats.html` (veřejné) — počet sad, celkem odehráno, počet učitelů, průměrné hodnocení,
žebříček nejhranějších sad, rozpad podle témat, sloupcový graf her za posledních 30 dní.
Každé spuštění otázky započítá hru (jednou za sadu za relaci, aby přeskakování otázek
nenafukovalo čísla).

---

## Spuštění lokálně

```bash
npm install
cp .env.example .env      # uprav JWT_SECRET a ADMIN_PASSWORD
node seed.js              # naplní otázky + admina (idempotentní)
npm start
```

Otevři `http://localhost:3000` — přivítá tě rozcestník CS/EN. Výchozí admin: `admin@skola.cz` / `admin123` — **hned změň**.

Bez nastaveného SMTP se ověřovací odkazy vypisují do logu serveru, takže lze testovat bez mailu.

---

## Nasazení na Coolify

1. Push do GitHubu, v Coolify vytvoř aplikaci z repozitáře (build pack: Dockerfile).
2. **Persistent storage** → bind mount `/opt/family-feud-data` → `/data`.
3. Environment variables podle `.env.example`. Nezapomeň na:
   - `JWT_SECRET` — `openssl rand -hex 32` (bez něj se po restartu odhlásí všichni)
   - `PUBLIC_URL` — např. `https://feud.prece.cz`, jde do ověřovacích odkazů
   - `ADMIN_PASSWORD`
4. V Cloudflare přidej DNS záznam pro subdoménu a nasměruj tunel na port 3000.

> ⚠️ Dockerfile **záměrně neobsahuje `VOLUME`**. Anonymní svazek by se při redeployi
> zahodil i s databází. Data drž výhradně na bind mountu.

### Záloha

```bash
sqlite3 /opt/family-feud-data/feud.db ".backup '/opt/zalohy/feud-$(date +%F).db'"
```

---

## Poznámka k Cloudflare Access

Pokud dáš aplikaci za Cloudflare Access, přihlašování a registrace zvenčí přestanou dávat smysl
(Access pustí dovnitř jen tebe). Pro veřejné příspěvky hostů nech doménu bez Access
a spolehni se na vestavěnou registraci + CAPTCHA + moderaci.

## Testy

```bash
npm test              # obojí
npm run test:smoke    # jen API a stránky
npm run test:upgrade  # jen bezpečnost redeploye
```

Smoke test (`test/smoke.js`) nastartuje server nad dočasnou databází a projde
47 kontrol: seed a jeho idempotence, dostupnost všech stránek, oddělení jazyků,
CAPTCHA, ověření e-mailu, moderační frontu, oprávnění, hodnocení, statistiky,
zvukový engine a validaci. Upgrade test (`test/upgrade.js`) přidává dalších 14
kontrol nad simulovanou nasazenou instancí.
Nepotřebuje žádnou testovací knihovnu, takže projekt nemá dev závislosti.

GitHub Actions (`.github/workflows/ci.yml`) navíc při každém pushi:

- pustí smoke test na Node 20 i 22,
- postaví Docker image,
- nastartuje kontejner a ověří `/health` a naseedovaný obsah,
- **restartuje kontejner a zkontroluje, že data přežila** — pojistka proti tomu,
  aby se do Dockerfilu někdy vrátila direktiva `VOLUME`.

---

## Struktura projektu

```
├── server.js           Express server, REST API
├── db.js               SQLite schéma + migrace
├── auth.js             JWT, CAPTCHA, odesílání e-mailů
├── seed.js             zápis sad do DB + admin účet
├── seed-util.js        parser kompaktního zápisu a validace
├── seed-cs.js          české sady (15 × 10 otázek)
├── seed-en.js          anglické ESL sady (25 × 10 otázek)
├── public/
│   ├── index.html      rozcestník CS / EN
│   ├── catalog.html    katalog sad
│   ├── host.html       okno moderátora
│   ├── display.html    okno pro žáky
│   ├── create.html     tvorba a import sad
│   ├── admin.html      moderace
│   ├── stats.html      statistiky
│   ├── audio.js        syntéza zvuků a znělek (WebAudio)
│   ├── i18n.js         překlady a přepínání jazyka
│   ├── app.js          API klient, přihlášení, navigace
│   └── style.css
├── test/smoke.js       smoke test API a stránek
├── test/upgrade.js     test bezpečného redeploye
└── Dockerfile          bez VOLUME (viz nasazení)
```

---

## Přispívání

Pull requesty vítány. Před odesláním prosím spusť `npm test`.

Nové sady otázek se dají přidat dvěma způsoby:

1. **Přes aplikaci** — `/create.html`, sadu pak schválí admin (doporučeno pro učitele).
2. **Do seedu** — `seed.js` (české) nebo `seed-en.js` (anglické) pro sady,
   které mají být součástí výchozí instalace.

U anglických sad prosím drž značení úrovní `Grade 3–5 (A1)`, `Grade 6–7 (A1–A2)`,
`Grade 8–9 (A2–B1)`, aby fungovalo filtrování.

---

## Licence

MIT — viz [LICENSE](LICENSE).

Název *Family Feud* je ochranná známka Fremantle; tento projekt je nekomerční
výuková pomůcka bez jakékoli vazby na držitele známky a nepoužívá jeho grafiku,
zvuky ani otázky.

---

## API

| Metoda | Endpoint | Přístup |
|---|---|---|
| GET | `/api/auth/captcha` | veřejné |
| POST | `/api/auth/register` · `/api/auth/login` · `/api/auth/logout` | veřejné |
| GET | `/api/auth/verify?token=` | veřejné |
| GET | `/api/sets?lang=cs\|en` · `/api/sets/meta?lang=` · `/api/sets/:id` | veřejné (respektuje viditelnost) |
| POST/PUT/DELETE | `/api/sets` · `/api/sets/:id` | ověřený uživatel |
| POST | `/api/sets/:id/play` | veřejné |
| POST | `/api/sets/:id/rating` | ověřený uživatel |
| GET | `/api/stats` | veřejné |
| GET | `/api/admin/queue` · `/api/admin/users` | admin |
| POST | `/api/admin/sets/:id/review` · `/api/admin/sets/:id/visibility` | admin |

Rate limiting je aktivní na registraci, přihlášení, vytváření sad a hodnocení.
