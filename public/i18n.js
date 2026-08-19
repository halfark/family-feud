// ============ Jazyková vrstva / language layer ============
// Jazyk se drží v localStorage a dá se přepsat parametrem ?lang=cs|en

const DICT = {
  brand:        { cs: '5 proti 5',            en: 'Family Feud' },
  brand_sub:    { cs: 'Výuková soutěž',       en: 'ESL Classroom Game' },

  // --- navigace ---
  nav_catalog:  { cs: 'Katalog',              en: 'Catalogue' },
  nav_play:     { cs: 'Hrát',                 en: 'Play' },
  nav_stats:    { cs: 'Statistiky',           en: 'Statistics' },
  nav_create:   { cs: 'Vytvořit sadu',        en: 'Create set' },
  nav_admin:    { cs: '⚙ Admin',              en: '⚙ Admin' },
  nav_login:    { cs: 'Přihlásit',            en: 'Log in' },
  nav_register: { cs: 'Registrace',           en: 'Sign up' },
  nav_logout:   { cs: 'Odhlásit',             en: 'Log out' },
  nav_switch:   { cs: 'Change language',      en: 'Změnit jazyk' },

  // --- obecné ---
  loading:      { cs: 'Načítám…',             en: 'Loading…' },
  cancel:       { cs: 'Zrušit',               en: 'Cancel' },
  close:        { cs: 'Zavřít',               en: 'Close' },
  delete:       { cs: 'Smazat',               en: 'Delete' },
  author:       { cs: 'Autor',                en: 'Author' },
  questions_n:  { cs: 'otázek',               en: 'questions' },
  no_rating:    { cs: 'Bez hodnocení',        en: 'Not rated yet' },

  // --- rozcestník ---
  land_pick:    { cs: 'Vyberte verzi hry',    en: 'Choose your version' },
  land_cs_desc: { cs: 'Česká verze pro prvouku, přírodovědu, vlastivědu, češtinu a další předměty 1.–9. třídy.',
                  en: 'Czech version for science, geography, Czech language and other subjects, grades 1–9.' },
  land_en_desc: { cs: 'Anglická verze pro výuku angličtiny — slovní zásoba a konverzace pro 3.–9. třídu (A1–B1).',
                  en: 'English version for ESL lessons — vocabulary and speaking for grades 3–9 (A1–B1).' },
  land_enter:   { cs: 'Vstoupit',             en: 'Enter' },
  land_sets:    { cs: 'sad otázek',           en: 'question sets' },
  land_note:    { cs: 'Jazyk lze kdykoli přepnout v horní liště.',
                  en: 'You can switch the language anytime in the top bar.' },

  // --- přihlášení ---
  au_login:     { cs: 'Přihlášení',           en: 'Log in' },
  au_register:  { cs: 'Registrace',           en: 'Sign up' },
  au_email:     { cs: 'E-mail',               en: 'E-mail' },
  au_pass:      { cs: 'Heslo',                en: 'Password' },
  au_pass_new:  { cs: 'Heslo (min. 8 znaků)', en: 'Password (min. 8 characters)' },
  au_name:      { cs: 'Jméno / přezdívka',    en: 'Name / nickname' },
  au_captcha:   { cs: '🔒 Kontrolní otázka',  en: '🔒 Security question' },
  au_cap_ph:    { cs: 'Vaše odpověď',         en: 'Your answer' },
  au_do_login:  { cs: 'Přihlásit se',         en: 'Log in' },
  au_do_reg:    { cs: 'Zaregistrovat',        en: 'Create account' },
  au_no_acc:    { cs: 'Nemáte účet?',         en: "Don't have an account?" },
  au_has_acc:   { cs: 'Už máte účet?',        en: 'Already registered?' },
  au_reg_here:  { cs: 'Zaregistrujte se',     en: 'Sign up' },
  au_log_here:  { cs: 'Přihlaste se',         en: 'Log in' },
  au_verify:    { cs: 'Po registraci vám přijde ověřovací e-mail. Bez ověření nelze přidávat ani hodnotit sady.',
                  en: 'A verification e-mail will be sent to you. You cannot submit or rate sets until you verify.' },
  au_cap_load:  { cs: 'Načítám kontrolní otázku…', en: 'Loading security question…' },
  au_cap_fail:  { cs: 'Nepodařilo se načíst captchu.', en: 'Could not load the captcha.' },
  au_back_log:  { cs: 'Zpět na přihlášení',   en: 'Back to log in' },
  au_dev_link:  { cs: 'Vývojový odkaz:',      en: 'Development link:' },
  au_logged:    { cs: 'Přihlášeno!',          en: 'Logged in!' },

  // --- katalog ---
  cat_filter:   { cs: 'Filtrovat sady',       en: 'Filter sets' },
  cat_search:   { cs: 'Hledat podle názvu…',  en: 'Search by title…' },
  cat_topics:   { cs: 'Všechna témata',       en: 'All topics' },
  cat_grades:   { cs: 'Všechny ročníky',      en: 'All grades' },
  cat_sort_new: { cs: 'Nejnovější',           en: 'Newest' },
  cat_sort_pl:  { cs: 'Nejhranější',          en: 'Most played' },
  cat_sort_ra:  { cs: 'Nejlépe hodnocené',    en: 'Best rated' },
  cat_sort_ti:  { cs: 'Podle názvu',          en: 'By title' },
  cat_mine:     { cs: 'Zobrazit jen mé sady (včetně čekajících na schválení)',
                  en: 'Show only my sets (including those awaiting approval)' },
  cat_empty:    { cs: 'Žádné sady neodpovídají filtru.', en: 'No sets match your filter.' },
  cat_play:     { cs: '▶ Hrát',               en: '▶ Play' },
  cat_detail:   { cs: 'Detail',               en: 'Details' },
  cat_qs:       { cs: 'Otázky',               en: 'Questions' },
  cat_start:    { cs: '▶ Spustit hru',        en: '▶ Start game' },
  cat_comments: { cs: 'Komentáře',            en: 'Comments' },
  cat_rate:     { cs: 'Ohodnoťte tuto sadu',  en: 'Rate this set' },
  cat_rerate:   { cs: 'Vaše hodnocení (můžete změnit)', en: 'Your rating (you can change it)' },
  cat_comm_ph:  { cs: 'Komentář (nepovinný) — jak se sada osvědčila ve výuce?',
                  en: 'Comment (optional) — how did this set work in your lesson?' },
  cat_send_rate:{ cs: 'Odeslat hodnocení',    en: 'Submit rating' },
  cat_login_rate:{cs: 'abyste mohli sadu ohodnotit.', en: 'to rate this set.' },
  cat_pick_star:{ cs: 'Vyberte počet hvězd.', en: 'Please pick a star rating.' },
  cat_rated:    { cs: 'Hodnocení uloženo, díky!', en: 'Rating saved, thank you!' },
  cat_del_conf: { cs: 'Opravdu smazat tuto sadu?', en: 'Really delete this set?' },
  cat_deleted:  { cs: 'Smazáno.',             en: 'Deleted.' },

  // --- stavy ---
  st_pending:   { cs: 'Čeká na schválení',    en: 'Awaiting approval' },
  st_rejected:  { cs: 'Zamítnuto',            en: 'Rejected' },
  st_public:    { cs: 'Veřejné',              en: 'Public' },
  st_private:   { cs: 'Soukromé',             en: 'Private' },
  st_reason:    { cs: 'Důvod',                en: 'Reason' },

  // --- moderátor ---
  ho_badge:     { cs: 'Moderátor',            en: 'Host' },
  ho_set:       { cs: 'Sada otázek',          en: 'Question set' },
  ho_pick:      { cs: '— vyberte sadu —',     en: '— choose a set —' },
  ho_nosets:    { cs: 'Žádné dostupné sady',  en: 'No sets available' },
  ho_opendisp:  { cs: '📺 Otevřít okno pro žáky', en: '📺 Open student window' },
  ho_disp_hint: { cs: 'Okno přetáhněte na projektor / druhou obrazovku a dejte fullscreen (F11).',
                  en: 'Drag the window to the projector / second screen and press F11 for fullscreen.' },
  ho_qlist:     { cs: 'Otázky v sadě',        en: 'Questions in set' },
  ho_clear_used: { cs: 'Odznačit',            en: 'Reset marks' },
  ho_keys:      { cs: 'Klávesové zkratky',    en: 'Keyboard shortcuts' },
  ho_k_reveal:  { cs: 'odhalit odpověď',      en: 'reveal answer' },
  ho_k_strike:  { cs: 'chyba',                en: 'strike' },
  ho_k_clear:   { cs: 'smazat chyby',         en: 'clear strikes' },
  ho_k_award:   { cs: 'body kola týmu 1 / 2', en: 'award round to team 1 / 2' },
  ho_k_nav:     { cs: 'další / předchozí otázka', en: 'next / previous question' },
  ho_k_all:     { cs: 'odhalit vše',          en: 'reveal all' },
  ho_k_turn:    { cs: 'přepnout tým',         en: 'switch team' },
  ho_k_sfx:     { cs: 'zapnout/vypnout zvuk', en: 'toggle sound' },
  ho_current:   { cs: 'Aktuální otázka',      en: 'Current question' },
  ho_prev:      { cs: '◀ Předchozí',          en: '◀ Previous' },
  ho_next:      { cs: 'Další ▶',              en: 'Next ▶' },
  ho_pick_set:  { cs: 'Vyberte sadu otázek →', en: 'Choose a question set →' },
  ho_pick_q:    { cs: 'Vyberte otázku ze seznamu vlevo →', en: 'Pick a question from the list on the left →' },
  ho_reveal_all:{ cs: 'Odhalit vše (R)',      en: 'Reveal all (R)' },
  ho_hide_all:  { cs: 'Skrýt vše',            en: 'Hide all' },
  ho_round:     { cs: 'Kolo',                 en: 'Round' },
  ho_pts:       { cs: 'b.',                   en: 'pts' },
  ho_strikes:   { cs: 'Chyby',                en: 'Strikes' },
  ho_strike_btn:{ cs: '✗ CHYBA',              en: '✗ STRIKE' },
  ho_clear:     { cs: 'Smazat (C)',           en: 'Clear (C)' },
  ho_game:      { cs: 'Hra',                  en: 'Game' },
  ho_turn:      { cs: '⇄ Na tahu (T)',        en: '⇄ Team turn (T)' },
  ho_intro:     { cs: 'Úvodní obrazovka',     en: 'Intro screen' },
  ho_reset:     { cs: 'Reset skóre',          en: 'Reset scores' },
  ho_winner:    { cs: 'Vyhlásit vítěze',      en: 'Announce winner' },
  ho_sfx:       { cs: 'Zvukové efekty (F)',   en: 'Sound effects (F)' },
  ho_scores:    { cs: 'Skóre týmů',           en: 'Team scores' },
  ho_award1:    { cs: 'Body kola → Tým 1 (Q)', en: 'Round points → Team 1 (Q)' },
  ho_award2:    { cs: 'Body kola → Tým 2 (W)', en: 'Round points → Team 2 (W)' },
  ho_conn_on:   { cs: 'Display okno připojeno', en: 'Student window connected' },
  ho_conn_off:  { cs: 'Display okno nepřipojeno', en: 'Student window not connected' },
  ho_loaded:    { cs: 'Načteno',              en: 'Loaded' },
  ho_zero:      { cs: 'Kolo má 0 bodů.',      en: 'The round has 0 points.' },
  ho_awarded:   { cs: 'bodů pro',             en: 'points for' },
  ho_reset_c:   { cs: 'Vynulovat skóre obou týmů?', en: 'Reset scores of both teams?' },
  ho_reset_ok:  { cs: 'Skóre vynulováno.',    en: 'Scores reset.' },
  ho_shown:     { cs: '✓ zobrazeno',          en: '✓ shown' },
  ho_key:       { cs: 'klávesa',              en: 'key' },
  ho_sfx_on:    { cs: 'Zvuk zapnut',          en: 'Sound on' },
  ho_sfx_off:   { cs: 'Zvuk vypnut',          en: 'Sound off' },
  team1:        { cs: 'TÝM 1',                en: 'TEAM 1' },
  team2:        { cs: 'TÝM 2',                en: 'TEAM 2' },

  // --- okno žáků ---
  di_ready:     { cs: 'PŘIPRAVENI?',          en: 'READY?' },
  di_waiting:   { cs: 'Čeká se na moderátora…', en: 'Waiting for the host…' },
  di_hint:      { cs: 'Otevřete okno moderátora a klikněte na „Otevřít okno pro žáky“',
                  en: 'Open the host window and click "Open student window"' },
  di_question:  { cs: 'Otázka',               en: 'Question' },
  di_round:     { cs: 'BODY KOLA',            en: 'ROUND POINTS' },
  di_offline:   { cs: '● odpojeno od moderátora', en: '● disconnected from host' },

  // --- tvorba sady ---
  cr_badge:     { cs: 'Nová sada',            en: 'New set' },
  cr_gate:      { cs: 'Pro vytváření sad se musíte přihlásit a mít ověřený e-mail.',
                  en: 'To create sets you must log in and verify your e-mail.' },
  cr_info:      { cs: 'Informace o sadě',     en: 'Set information' },
  cr_title:     { cs: 'Název sady',           en: 'Set title' },
  cr_title_ph:  { cs: 'např. Zvířata kolem nás', en: 'e.g. Animals Around Us' },
  cr_topic:     { cs: 'Téma / předmět',       en: 'Topic / subject' },
  cr_topic_ph:  { cs: 'např. Přírodověda',    en: 'e.g. Vocabulary' },
  cr_grade:     { cs: 'Ročník',               en: 'Grade' },
  cr_lang:      { cs: 'Jazyk sady',           en: 'Set language' },
  cr_vis:       { cs: 'Požadovaná viditelnost', en: 'Requested visibility' },
  cr_vis_pub:   { cs: 'Veřejná (pro všechny učitele)', en: 'Public (for all teachers)' },
  cr_vis_priv:  { cs: 'Soukromá (jen pro mě)', en: 'Private (only for me)' },
  cr_mod_note:  { cs: 'ℹ Sada půjde ke schválení administrátorovi. Ten rozhodne, zda ji zveřejní, nebo ponechá soukromou.',
                  en: 'ℹ The set will be sent to an administrator for approval. They decide whether to publish it or keep it private.' },
  cr_import:    { cs: 'Import z JSON',        en: 'Import from JSON' },
  cr_drop:      { cs: '📁 Přetáhněte JSON soubor sem nebo klikněte', en: '📁 Drop a JSON file here or click' },
  cr_tpl:       { cs: '⬇ Stáhnout vzor',      en: '⬇ Download template' },
  cr_exp:       { cs: '⬆ Exportovat rozpracované', en: '⬆ Export draft' },
  cr_addq:      { cs: '+ Přidat otázku',      en: '+ Add question' },
  cr_submit:    { cs: '💾 Odeslat ke schválení', en: '💾 Submit for approval' },
  cr_answer:    { cs: 'Odpověď',              en: 'Answer' },
  cr_points:    { cs: 'Body',                 en: 'Points' },
  cr_qph:       { cs: 'Text otázky…',         en: 'Question text…' },
  cr_addans:    { cs: '+ odpověď',            en: '+ answer' },
  cr_rules:     { cs: '2–8 odpovědí, body 1–99', en: '2–8 answers, points 1–99' },
  cr_delq:      { cs: 'Smazat otázku',        en: 'Delete question' },
  cr_need:      { cs: 'Přidejte alespoň jednu otázku se 2 odpověďmi.', en: 'Add at least one question with 2 answers.' },
  cr_loaded:    { cs: 'Načteno',              en: 'Loaded' },
  cr_badjson:   { cs: 'Soubor není platný JSON.', en: 'The file is not valid JSON.' },
  cr_nojson:    { cs: 'JSON neobsahuje pole "questions".', en: 'JSON has no "questions" array.' },

  // --- admin ---
  ad_badge:     { cs: 'Administrace',         en: 'Administration' },
  ad_gate:      { cs: 'Přístup jen pro administrátora.', en: 'Administrators only.' },
  ad_pending:   { cs: '⏳ Ke schválení',      en: '⏳ Pending' },
  ad_approved:  { cs: '✓ Schválené',          en: '✓ Approved' },
  ad_rejected:  { cs: '✕ Zamítnuté',          en: '✕ Rejected' },
  ad_users:     { cs: '👤 Uživatelé',         en: '👤 Users' },
  ad_empty:     { cs: 'Žádné sady v této kategorii.', en: 'No sets in this category.' },
  ad_view:      { cs: '👁 Zobrazit otázky',   en: '👁 View questions' },
  ad_app_pub:   { cs: '✓ Schválit veřejně',   en: '✓ Approve as public' },
  ad_app_priv:  { cs: '✓ Schválit soukromě',  en: '✓ Approve as private' },
  ad_reject:    { cs: '✕ Zamítnout',          en: '✕ Reject' },
  ad_toggle:    { cs: '⇄ Přepnout na',        en: '⇄ Switch to' },
  ad_try:       { cs: '▶ Vyzkoušet',          en: '▶ Try it' },
  ad_del:       { cs: '🗑 Smazat',            en: '🗑 Delete' },
  ad_reason:    { cs: 'Důvod zamítnutí (uvidí ho autor):', en: 'Rejection reason (the author will see it):' },
  ad_del_conf:  { cs: 'Nenávratně smazat tuto sadu i s hodnoceními?', en: 'Permanently delete this set and its ratings?' },
  ad_m_appr:    { cs: 'Schválené sady',       en: 'Approved sets' },
  ad_m_pend:    { cs: 'Čeká na schválení',    en: 'Awaiting approval' },
  ad_m_plays:   { cs: 'Celkem odehráno',      en: 'Games played' },
  ad_m_users:   { cs: 'Ověření uživatelé',    en: 'Verified users' },
  ad_m_rating:  { cs: 'Průměr hodnocení',     en: 'Average rating' },
  ad_t_name:    { cs: 'Jméno',                en: 'Name' },
  ad_t_state:   { cs: 'Stav',                 en: 'Status' },
  ad_t_sets:    { cs: 'Sady',                 en: 'Sets' },
  ad_t_reg:     { cs: 'Registrace',           en: 'Registered' },
  ad_verified:  { cs: 'ověřen',               en: 'verified' },
  ad_unverified:{ cs: 'neověřen',             en: 'unverified' },


  // --- zvuky ---
  snd_title:    { cs: 'Zvuk',                  en: 'Sound' },
  snd_on:       { cs: 'Zvukové efekty (F)',    en: 'Sound effects (F)' },
  snd_vol:      { cs: 'Hlasitost',             en: 'Volume' },
  snd_test:     { cs: '♪ Přehrát znělku',      en: '♪ Play theme' },
  snd_locked:   { cs: 'Klikněte kamkoli v okně žáků, aby prohlížeč povolil zvuk.',
                  en: 'Click anywhere in the student window to let the browser enable sound.' },

  // --- návod ---
  tut_open:     { cs: 'Návod',                 en: 'How to play' },
  tut_title:    { cs: 'Jak hrát',              en: 'How to play' },
  tut_intro:    { cs: 'Soutěž pro dva týmy. Žáci hádají nejčastější odpovědi z ankety — čím častější odpověď, tím víc bodů.',
                  en: 'A game for two teams. Students guess the most common survey answers — the more common the answer, the more points.' },
  tut_1_t:      { cs: '1. Otevřete druhé okno',  en: '1. Open the second window' },
  tut_1_d:      { cs: 'Klikněte na „Otevřít okno pro žáky“ a okno přetáhněte na projektor (F11 = celá obrazovka). Vy vidíte odpovědi i body, žáci jen prázdnou tabuli.',
                  en: 'Click "Open student window" and drag it to the projector (F11 for fullscreen). You see the answers and points; students see only the empty board.' },
  tut_2_t:      { cs: '2. Vyberte sadu a otázku', en: '2. Pick a set and a question' },
  tut_2_d:      { cs: 'Nahoře vlevo vyberte sadu podle předmětu a ročníku, pak klikněte na otázku v seznamu. Otázka se objeví na tabuli.',
                  en: 'Choose a set by subject and grade on the left, then click a question in the list. It appears on the board.' },
  tut_3_t:      { cs: '3. Odhalujte odpovědi',   en: '3. Reveal answers' },
  tut_3_d:      { cs: 'Když tým odpoví správně, klikněte na odpověď nebo zmáčkněte její číslo (1–8). Odpověď se otočí na tabuli i s body.',
                  en: 'When a team answers correctly, click the answer or press its number (1–8). It flips over on the board with its points.' },
  tut_4_t:      { cs: '4. Počítejte chyby',      en: '4. Count strikes' },
  tut_4_d:      { cs: 'Za špatnou odpověď zmáčkněte X nebo mezerník — na tabuli se objeví velký křížek. Po třech chybách kolo pro tým končí.',
                  en: 'Press X or Space for a wrong answer — a big cross appears on the board. After three strikes the team loses the round.' },
  tut_5_t:      { cs: '5. Připište body',        en: '5. Award the points' },
  tut_5_d:      { cs: 'Na konci kola zmáčkněte Q (tým 1) nebo W (tým 2). Nasbírané body kola se připíšou týmu a tabule se připraví na další otázku.',
                  en: 'At the end of a round press Q (team 1) or W (team 2). The round points go to that team and the board resets for the next question.' },
  tut_tip:      { cs: 'Tip: celou hru zvládnete z klávesnice — přehled zkratek máte vlevo dole.',
                  en: 'Tip: you can run the whole game from the keyboard — the shortcut list is at the bottom left.' },
  tut_close:    { cs: 'Rozumím, jdeme hrát',   en: "Got it, let's play" },
  tut_never:    { cs: 'Příště nezobrazovat',   en: "Don't show again" },

  // --- intro na tabuli ---
  di_intro_hint:{ cs: 'Kliknutím sem povolíte zvuk',
                  en: 'Click here to enable sound' },

  // --- statistiky ---
  stt_sets:     { cs: 'Sad otázek',           en: 'Question sets' },
  stt_plays:    { cs: 'Celkem odehráno',      en: 'Games played' },
  stt_users:    { cs: 'Učitelů',              en: 'Teachers' },
  stt_rating:   { cs: 'Průměrné hodnocení',   en: 'Average rating' },
  stt_top:      { cs: 'Nejhranější sady',     en: 'Most played sets' },
  stt_topics:   { cs: 'Podle tématu',         en: 'By topic' },
  stt_30d:      { cs: 'Odehrané hry (30 dní)', en: 'Games played (30 days)' },
  stt_none:     { cs: 'Zatím nikdo nehrál.',  en: 'No games played yet.' },
  stt_total:    { cs: 'celkem',               en: 'total' },
  stt_games:    { cs: 'her',                  en: 'games' },
  stt_max:      { cs: 'maximum',              en: 'peak' },
  stt_perday:   { cs: 'za den',               en: 'per day' },
  stt_bylang:   { cs: 'Podle jazyka',         en: 'By language' },
  stt_sets_w:   { cs: 'sad',                  en: 'sets' },
};

const LANGS = { cs: 'Čeština', en: 'English' };

function getLang() {
  const u = new URLSearchParams(location.search).get('lang');
  if (u === 'cs' || u === 'en') { localStorage.setItem('ff_lang', u); return u; }
  const s = localStorage.getItem('ff_lang');
  return (s === 'cs' || s === 'en') ? s : null;
}

let LANG = getLang() || 'cs';

function setLang(l) {
  if (l !== 'cs' && l !== 'en') return;
  LANG = l;
  localStorage.setItem('ff_lang', l);
}

function t(key) {
  const e = DICT[key];
  if (!e) return key;
  return e[LANG] ?? e.cs;
}

// Přeloží prvky s atributem data-i18n / data-i18n-ph (placeholder)
function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  root.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-ph'));
  });
  document.documentElement.lang = LANG;
}
