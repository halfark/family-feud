const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) {
  console.warn('⚠  JWT_SECRET není nastaven – používám náhodný. Po restartu se odhlásí všichni uživatelé.');
}
const PUBLIC_URL = (process.env.PUBLIC_URL || 'http://localhost:3000').replace(/\/$/, '');

// ---------------------------------------------------------------- CAPTCHA ---
// Serverová matematická captcha. Odpověď se neposílá klientovi – klient dostane
// jen zadání + podepsaný token, který drží hash správné odpovědi.
const CAPTCHA_TTL = 10 * 60 * 1000;

function makeCaptcha() {
  const ops = [
    () => { const a = 2 + Math.floor(Math.random() * 8), b = 2 + Math.floor(Math.random() * 8);
            return { q: `${a} + ${b}`, a: a + b }; },
    () => { const a = 5 + Math.floor(Math.random() * 10), b = 1 + Math.floor(Math.random() * 5);
            return { q: `${a} − ${b}`, a: a - b }; },
    () => { const a = 2 + Math.floor(Math.random() * 6), b = 2 + Math.floor(Math.random() * 6);
            return { q: `${a} × ${b}`, a: a * b }; },
  ];
  const { q, a } = ops[Math.floor(Math.random() * ops.length)]();
  const expires = Date.now() + CAPTCHA_TTL;
  const payload = `${a}.${expires}`;
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return { question: `Kolik je ${q}?`, token: `${expires}.${sig}`, _answer: a };
}

function verifyCaptcha(token, answer) {
  if (!token || answer === undefined || answer === null || answer === '') return false;
  const parts = String(token).split('.');
  if (parts.length !== 2) return false;
  const [expiresStr, sig] = parts;
  const expires = parseInt(expiresStr, 10);
  if (!expires || Date.now() > expires) return false;
  const expected = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${parseInt(answer, 10)}.${expires}`).digest('hex');
  const a = Buffer.from(sig, 'hex'), b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ------------------------------------------------------------------- MAIL ---
let transporter = null;
const MAIL_ENABLED = !!process.env.SMTP_HOST;

if (MAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
} else {
  console.warn('⚠  SMTP není nakonfigurováno – ověřovací odkazy se vypíšou do konzole serveru.');
}

async function sendVerificationEmail(email, name, token) {
  const link = `${PUBLIC_URL}/api/auth/verify?token=${token}`;
  if (!MAIL_ENABLED) {
    console.log('\n──────── OVĚŘOVACÍ ODKAZ (SMTP vypnuto) ────────');
    console.log(`  ${email}  →  ${link}`);
    console.log('────────────────────────────────────────────────\n');
    return { delivered: false, link };
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Family Feud" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Ověřte svůj e-mail – Family Feud',
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="color:#0A1628">Vítejte, ${escapeHtml(name)}!</h2>
      <p>Pro dokončení registrace potvrďte svou e-mailovou adresu:</p>
      <p style="margin:28px 0"><a href="${link}"
         style="background:#F5C518;color:#0A1628;padding:12px 28px;border-radius:6px;
                text-decoration:none;font-weight:bold">Ověřit e-mail</a></p>
      <p style="color:#666;font-size:13px">Odkaz je platný 24 hodin. Pokud jste se neregistrovali, e-mail ignorujte.</p>
    </div>`,
  });
  return { delivered: true, link: null };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ------------------------------------------------------------------- JWT ----
function signToken(user) {
  return jwt.sign({ uid: user.id, email: user.email, admin: !!user.is_admin },
    JWT_SECRET, { expiresIn: '30d' });
}

function readUser(req) {
  const token = req.cookies?.ff_token
    || (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!token) return null;
  try {
    const p = jwt.verify(token, JWT_SECRET);
    return db.prepare('SELECT id, email, display_name, is_admin, verified FROM users WHERE id = ?').get(p.uid) || null;
  } catch { return null; }
}

// Připojí req.user (nebo null) – nikdy neblokuje
function attachUser(req, res, next) { req.user = readUser(req); next(); }

// Vyžaduje přihlášeného a ověřeného uživatele
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Musíte se přihlásit.' });
  if (!req.user.verified) return res.status(403).json({ error: 'Nejdřív ověřte svůj e-mail.' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user?.is_admin) return res.status(403).json({ error: 'Přístup jen pro administrátora.' });
  next();
}

module.exports = {
  makeCaptcha, verifyCaptcha, sendVerificationEmail, MAIL_ENABLED,
  signToken, attachUser, requireAuth, requireAdmin, escapeHtml, PUBLIC_URL,
};
