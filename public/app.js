// ============================== API klient ==============================
const api = {
  async req(method, url, body) {
    const r = await fetch(url, {
      method, credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    let d = {};
    try { d = await r.json(); } catch {}
    if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
    return d;
  },
  get: (u) => api.req('GET', u),
  post: (u, b) => api.req('POST', u, b),
  put: (u, b) => api.req('PUT', u, b),
  del: (u) => api.req('DELETE', u),
};

// ============================== Toast ==============================
// POZOR: proměnná se NESMÍ jmenovat `t` – stínila by překladovou funkci t().
function toast(msg, kind = '') {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.className = 'toast show ' + kind;
  clearTimeout(el._tm);
  el._tm = setTimeout(() => { el.className = 'toast ' + kind; }, 3200);
}
const ok  = (m) => toast(m, 'ok');
const err = (m) => toast(m, 'err');

// ============================== Uživatel ==============================
let ME = null;
async function loadMe() {
  try { ME = (await api.get('/api/auth/me')).user; } catch { ME = null; }
  return ME;
}

function renderNav(active) {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const link = (href, label, id) =>
    `<a href="${href}" class="${active === id ? 'active' : ''}">${label}</a>`;

  let h = link('/catalog.html', t('nav_catalog'), 'catalog')
        + link('/host.html',    t('nav_play'),    'play')
        + link('/stats.html',   t('nav_stats'),   'stats');

  if (ME) {
    h += link('/create.html', t('nav_create'), 'create');
    if (ME.isAdmin) h += link('/admin.html', t('nav_admin'), 'admin');
  }

  h += `<a href="/?pick=1" title="${t('nav_home_tip')}">\u{1F310} ${t('nav_home')}</a>`;
  h += `<button onclick="switchLang()" title="${t('nav_switch')}" style="border-color:var(--line)">`
     + `${LANG === 'cs' ? '\u{1F1E8}\u{1F1FF} CS' : '\u{1F1EC}\u{1F1E7} EN'}</button>`;

  if (ME) {
    h += `<span class="badge ${ME.isAdmin ? 'gold' : 'grey'}">${escapeHtml(ME.displayName)}</span>`;
    h += `<button onclick="doLogout()">${t('nav_logout')}</button>`;
  } else {
    h += `<button class="btn btn-gold btn-sm" onclick="openAuth('login')">${t('nav_login')}</button>`;
    h += `<button class="btn btn-ghost btn-sm" onclick="openAuth('register')">${t('nav_register')}</button>`;
  }
  nav.innerHTML = h;

  // logotyp vede zpět na rozcestník (běžná webová konvence)
  const b = document.querySelector('.brand');
  if (b) {
    b.textContent = t('brand');
    b.style.cursor = 'pointer';
    b.title = t('nav_home_tip');
    b.onclick = () => { location.href = '/?pick=1'; };
  }
}

function switchLang() {
  setLang(LANG === 'cs' ? 'en' : 'cs');
  location.reload();
}

async function doLogout() {
  await api.post('/api/auth/logout');
  ME = null;
  location.reload();
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ============================== Auth modal ==============================
let captchaToken = null;

function ensureAuthModal() {
  if (document.getElementById('auth-modal')) return;
  const d = document.createElement('div');
  d.className = 'modal-bg'; d.id = 'auth-modal';
  d.onclick = (e) => { if (e.target === d) closeAuth(); };
  d.innerHTML = `<div class="modal"><h2 id="auth-title"></h2><div id="auth-body"></div></div>`;
  document.body.appendChild(d);
}

function openAuth(mode) {
  ensureAuthModal();
  document.getElementById('auth-modal').classList.add('open');
  mode === 'register' ? renderRegister() : renderLogin();
}
function closeAuth() { document.getElementById('auth-modal')?.classList.remove('open'); }

function renderLogin() {
  document.getElementById('auth-title').textContent = t('au_login');
  document.getElementById('auth-body').innerHTML = `
    <div class="field"><label class="lbl">${t('au_email')}</label>
      <input class="input" id="li-email" type="email" autocomplete="email"></div>
    <div class="field"><label class="lbl">${t('au_pass')}</label>
      <input class="input" id="li-pass" type="password" autocomplete="current-password"></div>
    <div style="display:flex;gap:.6rem;margin-top:1.2rem">
      <button class="btn btn-gold" style="flex:1" onclick="submitLogin()">${t('au_do_login')}</button>
      <button class="btn btn-ghost" onclick="closeAuth()">${t('cancel')}</button>
    </div>
    <p style="margin-top:1rem;font-size:.9rem;color:var(--muted)">${t('au_no_acc')}
      <a href="#" onclick="renderRegister();return false">${t('au_reg_here')}</a></p>`;
  document.getElementById('li-pass').onkeydown = e => { if (e.key === 'Enter') submitLogin(); };
}

async function submitLogin() {
  try {
    await api.post('/api/auth/login', {
      email: document.getElementById('li-email').value,
      password: document.getElementById('li-pass').value,
    });
    ok(t('au_logged')); closeAuth(); location.reload();
  } catch (e) { err(e.message); }
}

async function renderRegister() {
  document.getElementById('auth-title').textContent = t('au_register');
  const body = document.getElementById('auth-body');
  body.innerHTML = `<p style="color:var(--muted);font-size:.9rem">${t('au_cap_load')}</p>`;
  let cap;
  try { cap = await api.get('/api/auth/captcha'); }
  catch { body.innerHTML = `<p style="color:var(--red-br)">${t('au_cap_fail')}</p>`; return; }
  captchaToken = cap.token;

  body.innerHTML = `
    <div class="field"><label class="lbl">${t('au_name')}</label>
      <input class="input" id="rg-name" autocomplete="name"></div>
    <div class="field"><label class="lbl">${t('au_email')}</label>
      <input class="input" id="rg-email" type="email" autocomplete="email"></div>
    <div class="field"><label class="lbl">${t('au_pass_new')}</label>
      <input class="input" id="rg-pass" type="password" autocomplete="new-password"></div>
    <div class="field"><label class="lbl">${t('au_captcha')} — ${escapeHtml(cap.question)}</label>
      <input class="input" id="rg-cap" type="number" placeholder="${t('au_cap_ph')}"></div>
    <div style="display:flex;gap:.6rem;margin-top:1.2rem">
      <button class="btn btn-gold" style="flex:1" onclick="submitRegister()">${t('au_do_reg')}</button>
      <button class="btn btn-ghost" onclick="closeAuth()">${t('cancel')}</button>
    </div>
    <p style="margin-top:1rem;font-size:.85rem;color:var(--muted)">${t('au_verify')}</p>
    <p style="margin-top:.5rem;font-size:.9rem;color:var(--muted)">${t('au_has_acc')}
      <a href="#" onclick="renderLogin();return false">${t('au_log_here')}</a></p>`;
}

async function submitRegister() {
  try {
    const r = await api.post('/api/auth/register', {
      displayName: document.getElementById('rg-name').value,
      email:       document.getElementById('rg-email').value,
      password:    document.getElementById('rg-pass').value,
      captchaToken,
      captchaAnswer: document.getElementById('rg-cap').value,
    });
    document.getElementById('auth-body').innerHTML = `
      <div style="text-align:center;padding:1rem">
        <div style="font-size:44px;color:var(--green-br)">✓</div>
        <p style="margin:1rem 0;line-height:1.5">${escapeHtml(r.message)}</p>
        ${r.devLink ? `<p style="font-size:.82rem;color:var(--muted);word-break:break-all">
          ${t('au_dev_link')} <a href="${r.devLink}">${escapeHtml(r.devLink)}</a></p>` : ''}
        <button class="btn btn-gold" style="margin-top:1rem" onclick="renderLogin()">${t('au_back_log')}</button>
      </div>`;
  } catch (e) {
    err(e.message);
    if (/kontroln|captch|security/i.test(e.message)) renderRegister();
  }
}

// ============================== Utility ==============================
function starsHtml(avg, count) {
  if (!avg) return `<span style="color:var(--faint)">${t('no_rating')}</span>`;
  const full = Math.round(avg);
  return `<span class="stars">${'★'.repeat(full)}${'☆'.repeat(5 - full)}</span>`
       + `<span style="color:var(--muted)"> ${avg.toFixed(1)} (${count})</span>`;
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString(LANG === 'en' ? 'en-GB' : 'cs-CZ',
    { day: 'numeric', month: 'short', year: 'numeric' });
}

const langParam = () => 'lang=' + LANG;

// ============================== Bootstrap ==============================
async function bootstrap(activeNav) {
  // kdo si jazyk ještě nevybral, jde na rozcestník
  if (!getLang()) { location.replace('/?pick=1'); return; }
  applyI18n();
  await loadMe();
  renderNav(activeNav);
}
