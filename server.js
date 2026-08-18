const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

const db = require('./db');
const A = require('./auth');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.set('trust proxy', 1); // za Cloudflare Tunnel / Traefik
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(A.attachUser);

const limiter = (max, minutes) => rateLimit({
  windowMs: minutes * 60 * 1000, max,
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'Příliš mnoho požadavků, zkuste to za chvíli.' },
});

// ============================================================ VALIDACE ======
function validateSetPayload(body) {
  const title = String(body.title || '').trim();
  const topic = String(body.topic || '').trim();
  const grade = String(body.grade || '').trim();
  if (title.length < 3 || title.length > 120) return { error: 'Název musí mít 3–120 znaků.' };
  if (!topic || topic.length > 60) return { error: 'Zadejte téma (max 60 znaků).' };
  if (!grade || grade.length > 40) return { error: 'Zadejte ročník.' };

  const language = body.language === 'en' ? 'en' : 'cs';

  const qs = Array.isArray(body.questions) ? body.questions : null;
  if (!qs || qs.length < 1 || qs.length > 25) return { error: 'Sada musí mít 1–25 otázek.' };

  const clean = [];
  for (const q of qs) {
    const qt = String(q.question || '').trim();
    if (qt.length < 5 || qt.length > 300) return { error: `Otázka musí mít 5–300 znaků: "${qt.slice(0, 30)}…"` };
    const ans = Array.isArray(q.answers) ? q.answers : [];
    if (ans.length < 2 || ans.length > 8) return { error: `Otázka "${qt.slice(0, 30)}…" musí mít 2–8 odpovědí.` };
    const ca = [];
    for (const a of ans) {
      const t = String(a.text || '').trim();
      const p = parseInt(a.points, 10);
      if (!t || t.length > 80) return { error: 'Odpověď musí mít 1–80 znaků.' };
      if (!Number.isFinite(p) || p < 1 || p > 99) return { error: 'Body musí být 1–99.' };
      ca.push({ text: t, points: p });
    }
    ca.sort((x, y) => y.points - x.points);
    clean.push({ question: qt, answers: ca });
  }
  return { title, topic, grade, language, questions: clean };
}

// ================================================================ AUTH ======
app.get('/api/auth/captcha', (req, res) => {
  const c = A.makeCaptcha();
  res.json({ question: c.question, token: c.token });
});

app.post('/api/auth/register', limiter(10, 15), async (req, res) => {
  try {
    const { email, password, displayName, captchaToken, captchaAnswer } = req.body || {};
    if (!A.verifyCaptcha(captchaToken, captchaAnswer))
      return res.status(400).json({ error: 'Špatná odpověď na kontrolní otázku. Zkuste novou.' });

    const em = String(email || '').trim().toLowerCase();
    const name = String(displayName || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))
      return res.status(400).json({ error: 'Neplatná e-mailová adresa.' });
    if (name.length < 2 || name.length > 60)
      return res.status(400).json({ error: 'Jméno musí mít 2–60 znaků.' });
    if (String(password || '').length < 8)
      return res.status(400).json({ error: 'Heslo musí mít alespoň 8 znaků.' });

    if (db.prepare('SELECT id FROM users WHERE email = ?').get(em))
      return res.status(409).json({ error: 'Tento e-mail už je zaregistrovaný.' });

    const token = crypto.randomBytes(32).toString('hex');
    db.prepare(`INSERT INTO users (email, password_hash, display_name, is_admin, verified,
                verify_token, verify_expires, created_at) VALUES (?,?,?,0,0,?,?,?)`)
      .run(em, bcrypt.hashSync(password, 10), name, token, Date.now() + 864e5, Date.now());

    const r = await A.sendVerificationEmail(em, name, token);
    res.json({ ok: true, mailSent: r.delivered, devLink: r.link,
      message: r.delivered
        ? 'Registrace proběhla. Zkontrolujte e-mail a klikněte na ověřovací odkaz.'
        : 'Registrace proběhla. SMTP není nastaveno – ověřovací odkaz najdete v logu serveru.' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Chyba serveru.' }); }
});

app.get('/api/auth/verify', (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE verify_token = ?').get(String(req.query.token || ''));
  if (!u || !u.verify_expires || Date.now() > u.verify_expires)
    return res.status(400).send(page('Odkaz je neplatný nebo vypršel.', false));
  db.prepare('UPDATE users SET verified = 1, verify_token = NULL, verify_expires = NULL WHERE id = ?').run(u.id);
  res.send(page('E-mail ověřen! Nyní se můžete přihlásit.', true));
});

function page(msg, ok) {
  return `<!doctype html><meta charset="utf-8"><title>Ověření</title>
  <div style="font-family:system-ui;background:#0A1628;color:#fff;min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;margin:0">
  <div style="font-size:56px">${ok ? '✓' : '✕'}</div>
  <h1 style="color:${ok ? '#F5C518' : '#E74C3C'};font-size:22px;text-align:center;padding:0 20px">${A.escapeHtml(msg)}</h1>
  <a href="/" style="background:#F5C518;color:#0A1628;padding:12px 28px;border-radius:6px;
  text-decoration:none;font-weight:bold">Zpět do aplikace</a></div>`;
}

app.post('/api/auth/login', limiter(20, 15), (req, res) => {
  const em = String(req.body?.email || '').trim().toLowerCase();
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(em);
  if (!u || !bcrypt.compareSync(String(req.body?.password || ''), u.password_hash))
    return res.status(401).json({ error: 'Nesprávný e-mail nebo heslo.' });
  if (!u.verified) return res.status(403).json({ error: 'Účet není ověřený. Zkontrolujte e-mail.' });
  res.cookie('ff_token', A.signToken(u), {
    httpOnly: true, sameSite: 'lax', maxAge: 30 * 864e5,
    secure: (process.env.PUBLIC_URL || '').startsWith('https'),
  });
  res.json({ ok: true, user: { id: u.id, email: u.email, displayName: u.display_name, isAdmin: !!u.is_admin } });
});

app.post('/api/auth/logout', (req, res) => { res.clearCookie('ff_token'); res.json({ ok: true }); });

app.get('/api/auth/me', (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: { id: req.user.id, email: req.user.email,
    displayName: req.user.display_name, isAdmin: !!req.user.is_admin, verified: !!req.user.verified } });
});

// ================================================================ SETS ======
const setSummary = `
  s.id, s.title, s.topic, s.grade, s.language, s.author_name, s.status, s.visibility,
  s.play_count, s.created_at, s.reject_reason,
  (SELECT ROUND(AVG(stars),2) FROM ratings r WHERE r.set_id = s.id) AS avg_rating,
  (SELECT COUNT(*)            FROM ratings r WHERE r.set_id = s.id) AS rating_count,
  (SELECT COUNT(*) FROM json_each(json_extract(s.data_json,'$.questions'))) AS question_count`;

// Veřejný katalog + vlastní sady uživatele
app.get('/api/sets', (req, res) => {
  const { topic, grade, q, sort, mine, lang } = req.query;
  const where = [], params = {};

  if (mine === '1') {
    if (!req.user) return res.status(401).json({ error: 'Musíte se přihlásit.' });
    where.push('s.author_id = @uid'); params.uid = req.user.id;
  } else {
    // veřejné schválené + (pokud přihlášen) vlastní schválené soukromé
    if (req.user) {
      where.push(`(s.status='approved' AND (s.visibility='public' OR s.author_id=@uid))`);
      params.uid = req.user.id;
    } else {
      where.push(`s.status='approved' AND s.visibility='public'`);
    }
  }
  if (lang === 'cs' || lang === 'en') { where.push('s.language = @lang'); params.lang = lang; }
  if (topic) { where.push('s.topic = @topic'); params.topic = topic; }
  if (grade) { where.push('s.grade = @grade'); params.grade = grade; }
  if (q) { where.push('(s.title LIKE @q OR s.topic LIKE @q)'); params.q = `%${q}%`; }

  const order = { plays: 's.play_count DESC', rating: 'avg_rating DESC NULLS LAST',
                  title: 's.title ASC' }[sort] || 's.created_at DESC';

  const rows = db.prepare(`SELECT ${setSummary} FROM sets s
    WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT 300`).all(params);
  res.json({ sets: rows });
});

app.get('/api/sets/meta', (req, res) => {
  const lang = (req.query.lang === 'cs' || req.query.lang === 'en') ? req.query.lang : null;
  const cond = `status='approved' AND visibility='public'` + (lang ? ` AND language=@lang` : '');
  const p = lang ? { lang } : {};
  const topics = db.prepare(`SELECT DISTINCT topic FROM sets WHERE ${cond} ORDER BY topic`).all(p).map(r => r.topic);
  const grades = db.prepare(`SELECT DISTINCT grade FROM sets WHERE ${cond} ORDER BY grade`).all(p).map(r => r.grade);
  const counts = db.prepare(`SELECT language, COUNT(*) c FROM sets
    WHERE status='approved' AND visibility='public' GROUP BY language`).all();
  res.json({ topics, grades, counts: Object.fromEntries(counts.map(r => [r.language, r.c])) });
});

// Detail včetně otázek (kontrola přístupu)
app.get('/api/sets/:id', (req, res) => {
  const s = db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sada nenalezena.' });
  const owner = req.user && (req.user.id === s.author_id || req.user.is_admin);
  const publicOk = s.status === 'approved' && s.visibility === 'public';
  if (!publicOk && !owner) return res.status(403).json({ error: 'K této sadě nemáte přístup.' });

  const agg = db.prepare(`SELECT ROUND(AVG(stars),2) a, COUNT(*) c FROM ratings WHERE set_id = ?`).get(s.id);
  const myRating = req.user
    ? db.prepare('SELECT stars, comment FROM ratings WHERE set_id=? AND user_id=?').get(s.id, req.user.id)
    : null;

  res.json({ set: {
    id: s.id, title: s.title, topic: s.topic, grade: s.grade, language: s.language,
    authorName: s.author_name, status: s.status, visibility: s.visibility,
    playCount: s.play_count, createdAt: s.created_at, rejectReason: s.reject_reason,
    avgRating: agg.a, ratingCount: agg.c, myRating,
    questions: JSON.parse(s.data_json).questions,
    isOwner: !!owner,
  }});
});

// Vytvoření sady – vždy jde do fronty ke schválení
app.post('/api/sets', A.requireAuth, limiter(20, 60), (req, res) => {
  const v = validateSetPayload(req.body || {});
  if (v.error) return res.status(400).json({ error: v.error });
  const vis = req.body.visibility === 'public' ? 'public' : 'private';

  const info = db.prepare(`INSERT INTO sets (title, topic, grade, data_json, language, author_id,
    author_name, status, visibility, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(v.title, v.topic, v.grade, JSON.stringify({ questions: v.questions }), v.language,
      req.user.id, req.user.display_name,
      req.user.is_admin ? 'approved' : 'pending', vis, Date.now());

  res.json({ ok: true, id: info.lastInsertRowid,
    message: req.user.is_admin
      ? 'Sada byla uložena a rovnou schválena.'
      : 'Sada byla odeslána ke schválení administrátorovi.' });
});

// Úprava vlastní sady – po editaci jde znovu ke schválení
app.put('/api/sets/:id', A.requireAuth, (req, res) => {
  const s = db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sada nenalezena.' });
  if (s.author_id !== req.user.id && !req.user.is_admin)
    return res.status(403).json({ error: 'Můžete upravovat jen vlastní sady.' });

  const v = validateSetPayload(req.body || {});
  if (v.error) return res.status(400).json({ error: v.error });
  const vis = req.body.visibility === 'public' ? 'public' : 'private';

  db.prepare(`UPDATE sets SET title=?, topic=?, grade=?, data_json=?, language=?, visibility=?,
    status=?, reject_reason=NULL WHERE id=?`)
    .run(v.title, v.topic, v.grade, JSON.stringify({ questions: v.questions }), v.language, vis,
      req.user.is_admin ? s.status : 'pending', s.id);

  res.json({ ok: true, message: req.user.is_admin ? 'Uloženo.' : 'Uloženo a odesláno ke schválení.' });
});

app.delete('/api/sets/:id', A.requireAuth, (req, res) => {
  const s = db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sada nenalezena.' });
  if (s.author_id !== req.user.id && !req.user.is_admin)
    return res.status(403).json({ error: 'Můžete mazat jen vlastní sady.' });
  db.prepare('DELETE FROM sets WHERE id = ?').run(s.id);
  res.json({ ok: true });
});

// ============================================================== STATS =======
app.post('/api/sets/:id/play', limiter(120, 60), (req, res) => {
  const s = db.prepare('SELECT id FROM sets WHERE id = ?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sada nenalezena.' });
  db.prepare('UPDATE sets SET play_count = play_count + 1 WHERE id = ?').run(s.id);
  db.prepare('INSERT INTO plays (set_id, played_at) VALUES (?,?)').run(s.id, Date.now());
  const pc = db.prepare('SELECT play_count FROM sets WHERE id = ?').get(s.id).play_count;
  res.json({ ok: true, playCount: pc });
});

app.get('/api/stats', (req, res) => {
  const totals = db.prepare(`SELECT
    (SELECT COUNT(*) FROM sets WHERE status='approved') AS sets_approved,
    (SELECT COUNT(*) FROM sets WHERE status='pending')  AS sets_pending,
    (SELECT COUNT(*) FROM plays)                        AS total_plays,
    (SELECT COUNT(*) FROM users WHERE verified=1)       AS users,
    (SELECT ROUND(AVG(stars),2) FROM ratings)           AS avg_rating`).get();

  const top = db.prepare(`SELECT s.id, s.title, s.topic, s.grade, s.language, s.play_count,
    (SELECT ROUND(AVG(stars),2) FROM ratings r WHERE r.set_id=s.id) avg_rating,
    (SELECT COUNT(*) FROM ratings r WHERE r.set_id=s.id) rating_count
    FROM sets s WHERE s.status='approved' AND s.visibility='public'
    ORDER BY s.play_count DESC LIMIT 10`).all();

  const byTopic = db.prepare(`SELECT topic, language, COUNT(*) sets, SUM(play_count) plays
    FROM sets WHERE status='approved' GROUP BY topic, language ORDER BY plays DESC`).all();

  const byLang = db.prepare(`SELECT language, COUNT(*) sets, SUM(play_count) plays
    FROM sets WHERE status='approved' GROUP BY language`).all();

  const since = Date.now() - 30 * 864e5;
  const recent = db.prepare(`SELECT date(played_at/1000,'unixepoch') d, COUNT(*) c
    FROM plays WHERE played_at > ? GROUP BY d ORDER BY d`).all(since);

  res.json({ totals, top, byTopic, byLang, recent });
});

// ============================================================ RATINGS =======
app.post('/api/sets/:id/rating', A.requireAuth, limiter(40, 60), (req, res) => {
  const s = db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sada nenalezena.' });
  if (s.status !== 'approved') return res.status(400).json({ error: 'Neschválenou sadu nelze hodnotit.' });

  const stars = parseInt(req.body?.stars, 10);
  if (!Number.isFinite(stars) || stars < 1 || stars > 5)
    return res.status(400).json({ error: 'Hodnocení musí být 1–5 hvězd.' });
  const comment = String(req.body?.comment || '').trim().slice(0, 500) || null;

  db.prepare(`INSERT INTO ratings (set_id, user_id, stars, comment, created_at)
    VALUES (?,?,?,?,?) ON CONFLICT(set_id, user_id)
    DO UPDATE SET stars=excluded.stars, comment=excluded.comment, created_at=excluded.created_at`)
    .run(s.id, req.user.id, stars, comment, Date.now());

  const agg = db.prepare('SELECT ROUND(AVG(stars),2) a, COUNT(*) c FROM ratings WHERE set_id=?').get(s.id);
  res.json({ ok: true, avgRating: agg.a, ratingCount: agg.c });
});

app.get('/api/sets/:id/ratings', (req, res) => {
  const rows = db.prepare(`SELECT r.stars, r.comment, r.created_at, u.display_name
    FROM ratings r JOIN users u ON u.id = r.user_id
    WHERE r.set_id = ? AND r.comment IS NOT NULL
    ORDER BY r.created_at DESC LIMIT 50`).all(req.params.id);
  res.json({ ratings: rows });
});

// ============================================================== ADMIN =======
app.get('/api/admin/queue', A.requireAuth, A.requireAdmin, (req, res) => {
  const status = ['pending', 'approved', 'rejected'].includes(req.query.status)
    ? req.query.status : 'pending';
  const rows = db.prepare(`SELECT ${setSummary} FROM sets s
    WHERE s.status = ? ORDER BY s.created_at DESC LIMIT 200`).all(status);
  res.json({ sets: rows });
});

app.post('/api/admin/sets/:id/review', A.requireAuth, A.requireAdmin, (req, res) => {
  const s = db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sada nenalezena.' });

  const action = req.body?.action;                                   // approve | reject
  const visibility = req.body?.visibility === 'public' ? 'public' : 'private';
  if (action === 'approve') {
    db.prepare(`UPDATE sets SET status='approved', visibility=?, reject_reason=NULL,
      reviewed_at=? WHERE id=?`).run(visibility, Date.now(), s.id);
    return res.json({ ok: true, message: `Schváleno jako ${visibility === 'public' ? 'veřejné' : 'soukromé'}.` });
  }
  if (action === 'reject') {
    const reason = String(req.body?.reason || '').trim().slice(0, 300) || 'Bez udání důvodu.';
    db.prepare(`UPDATE sets SET status='rejected', reject_reason=?, reviewed_at=? WHERE id=?`)
      .run(reason, Date.now(), s.id);
    return res.json({ ok: true, message: 'Zamítnuto.' });
  }
  res.status(400).json({ error: 'Neplatná akce.' });
});

app.post('/api/admin/sets/:id/visibility', A.requireAuth, A.requireAdmin, (req, res) => {
  const vis = req.body?.visibility === 'public' ? 'public' : 'private';
  db.prepare('UPDATE sets SET visibility=? WHERE id=?').run(vis, req.params.id);
  res.json({ ok: true, visibility: vis });
});

app.get('/api/admin/users', A.requireAuth, A.requireAdmin, (req, res) => {
  const rows = db.prepare(`SELECT u.id, u.email, u.display_name, u.is_admin, u.verified, u.created_at,
    (SELECT COUNT(*) FROM sets s WHERE s.author_id = u.id) AS set_count
    FROM users u ORDER BY u.created_at DESC LIMIT 300`).all();
  res.json({ users: rows });
});

// =============================================================== STATIC =====
// Chyby na /api/* vracej vždy jako JSON, ne jako HTML stránku Expressu
app.use('/api', (e, req, res, next) => {
  if (e?.type === 'entity.parse.failed')
    return res.status(400).json({ error: 'Neplatný JSON v těle požadavku.' });
  if (e?.type === 'entity.too.large')
    return res.status(413).json({ error: 'Požadavek je příliš velký.' });
  console.error(e);
  res.status(500).json({ error: 'Chyba serveru.' });
});

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎮 Family Feud běží na portu ${PORT}`);
  console.log(`   Katalog:   ${A.PUBLIC_URL}/`);
  console.log(`   Moderátor: ${A.PUBLIC_URL}/host.html`);
  console.log(`   Soutěžící: ${A.PUBLIC_URL}/display.html\n`);
});
