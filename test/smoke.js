#!/usr/bin/env node
/**
 * Smoke test – ověří, že se aplikace nastartuje a klíčové toky fungují.
 * Spouští se lokálně (`npm test`) i v GitHub Actions.
 *
 * Nepoužívá žádnou testovací knihovnu, aby projekt neměl dev závislosti.
 */
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = process.env.TEST_PORT || 3999;
const BASE = `http://127.0.0.1:${PORT}`;
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'feud-test-'));

let pass = 0, fail = 0;
const ok   = (m) => { pass++; console.log(`  \u2713 ${m}`); };
const bad  = (m) => { fail++; console.log(`  \u2717 ${m}`); };
const check = (cond, m) => cond ? ok(m) : bad(m);
const section = (m) => console.log(`\n=== ${m} ===`);

const env = {
  ...process.env,
  DATA_DIR,
  PORT: String(PORT),
  JWT_SECRET: 'smoke-test-secret',
  PUBLIC_URL: BASE,
  ADMIN_EMAIL: 'admin@test.cz',
  ADMIN_PASSWORD: 'testpass123',
};

// jednoduchá cookie jar
const jars = {};
async function req(method, url, { body, jar } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (jar && jars[jar]) headers['Cookie'] = jars[jar];
  const r = await fetch(BASE + url, {
    method, headers, body: body ? JSON.stringify(body) : undefined, redirect: 'manual',
  });
  const setCookie = r.headers.getSetCookie?.() || [];
  if (jar && setCookie.length) jars[jar] = setCookie.map(c => c.split(';')[0]).join('; ');
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: r.status, json, text };
}

async function waitForServer(tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(BASE + '/health');
      if (r.ok) return true;
    } catch {}
    await new Promise(res => setTimeout(res, 250));
  }
  return false;
}

(async () => {
  section('Seed');
  const seedOut = execFileSync('node', ['seed.js'], { env, encoding: 'utf8' });
  check(/Přidáno|už v databázi/.test(seedOut), 'seed proběhl');
  const seedOut2 = execFileSync('node', ['seed.js'], { env, encoding: 'utf8' });
  check(/už v databázi/.test(seedOut2), 'seed je idempotentní');

  const server = spawn('node', ['server.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverLog = '';
  server.stdout.on('data', d => { serverLog += d; });
  server.stderr.on('data', d => { serverLog += d; });

  try {
    if (!await waitForServer()) throw new Error('Server nenaběhl:\n' + serverLog);

    section('Statické stránky');
    for (const p of ['/', '/catalog.html', '/host.html', '/display.html',
                     '/create.html', '/admin.html', '/stats.html',
                     '/app.js', '/i18n.js', '/audio.js', '/style.css']) {
      const r = await req('GET', p);
      check(r.status === 200, `${p} → 200`);
    }
    const land = await req('GET', '/');
    check(/5 proti 5/.test(land.text) && /Family Feud/.test(land.text),
      'rozcestník nabízí obě jazykové verze');

    section('Zvukový engine');
    const audioSrc = (await req('GET', '/audio.js')).text;
    check(/FFAudio/.test(audioSrc), 'audio.js se servíruje');
    for (const snd of ['theme', 'reveal', 'strike', 'score', 'win'])
      check(new RegExp(`\\b${snd}\\b`).test(audioSrc), `zvuk "${snd}" je definován`);

    section('Dvojjazyčná databáze');
    const meta = await req('GET', '/api/sets/meta');
    check(meta.json?.counts?.cs > 0, `české sady naseedovány (${meta.json?.counts?.cs})`);
    check(meta.json?.counts?.en > 0, `anglické sady naseedovány (${meta.json?.counts?.en})`);

    for (const lang of ['cs', 'en']) {
      const r = await req('GET', `/api/sets?lang=${lang}`);
      const langs = new Set((r.json?.sets || []).map(s => s.language));
      check(langs.size === 1 && langs.has(lang),
        `?lang=${lang} vrací jen ${lang} sady (${r.json?.sets?.length})`);
    }

    section('CAPTCHA a registrace');
    const cap = await req('GET', '/api/auth/captcha');
    check(!!cap.json?.token && !!cap.json?.question, 'captcha se vygeneruje');
    check(!('_answer' in (cap.json || {})), 'captcha neposílá odpověď klientovi');

    const m = /(\d+)\s*([+\u2212\u00d7])\s*(\d+)/.exec(cap.json.question);
    const [a, op, b] = [Number(m[1]), m[2], Number(m[3])];
    const answer = op === '+' ? a + b : op === '\u2212' ? a - b : a * b;

    const badReg = await req('POST', '/api/auth/register', { body: {
      email: 'x@test.cz', password: 'heslo1234', displayName: 'Test',
      captchaToken: cap.json.token, captchaAnswer: answer + 1 } });
    check(badReg.status === 400, 'špatná captcha je odmítnuta');

    const reg = await req('POST', '/api/auth/register', { body: {
      email: 'ucitel@test.cz', password: 'heslo1234', displayName: 'Učitel',
      captchaToken: cap.json.token, captchaAnswer: answer } });
    check(reg.json?.ok === true, 'registrace se správnou captchou projde');

    const preLogin = await req('POST', '/api/auth/login', {
      body: { email: 'ucitel@test.cz', password: 'heslo1234' } });
    check(preLogin.status === 403, 'neověřený účet se nepřihlásí');

    const token = /verify\?token=([a-f0-9]+)/.exec(reg.json?.devLink || serverLog)?.[1];
    check(!!token, 'ověřovací token je k dispozici');
    const ver = await req('GET', `/api/auth/verify?token=${token}`);
    check(ver.status === 200, 'ověření e-mailu projde');

    const login = await req('POST', '/api/auth/login', {
      jar: 'user', body: { email: 'ucitel@test.cz', password: 'heslo1234' } });
    check(login.json?.ok === true, 'přihlášení po ověření projde');

    section('Moderace');
    const created = await req('POST', '/api/sets', { jar: 'user', body: {
      title: 'Testovací sada', topic: 'Test', grade: 'Grade 6–7 (A1–A2)',
      language: 'en', visibility: 'public',
      questions: [{ question: 'Name a test answer.', answers: [
        { text: 'Alpha', points: 60 }, { text: 'Beta', points: 40 }] }] } });
    check(created.json?.ok === true, 'uživatel odešle sadu');
    const setId = created.json?.id;

    const pub = await req('GET', '/api/sets?q=Testovac%C3%AD');
    check((pub.json?.sets || []).length === 0, 'neschválená sada není veřejně vidět');

    const mine = await req('GET', '/api/sets?mine=1', { jar: 'user' });
    check((mine.json?.sets || []).some(s => s.id === setId && s.status === 'pending'),
      'autor vidí svou sadu jako pending');

    const noAdmin = await req('GET', '/api/admin/queue', { jar: 'user' });
    check(noAdmin.status === 403, 'běžný uživatel nemá přístup do admin fronty');

    await req('POST', '/api/auth/login', { jar: 'admin',
      body: { email: 'admin@test.cz', password: 'testpass123' } });
    const queue = await req('GET', '/api/admin/queue?status=pending', { jar: 'admin' });
    check((queue.json?.sets || []).some(s => s.id === setId), 'sada je v admin frontě');

    const appr = await req('POST', `/api/admin/sets/${setId}/review`, { jar: 'admin',
      body: { action: 'approve', visibility: 'public' } });
    check(appr.json?.ok === true, 'admin sadu schválí');

    const pub2 = await req('GET', '/api/sets?q=Testovac%C3%AD');
    check((pub2.json?.sets || []).some(s => s.id === setId), 'schválená sada je veřejná');

    section('Hodnocení a statistiky');
    const anon = await req('POST', `/api/sets/${setId}/rating`, { body: { stars: 5 } });
    check(anon.status === 401, 'anonym nemůže hodnotit');

    const rate = await req('POST', `/api/sets/${setId}/rating`, { jar: 'user',
      body: { stars: 5, comment: 'Funguje.' } });
    check(rate.json?.avgRating === 5, 'hodnocení se uloží');

    await req('POST', `/api/sets/${setId}/play`);
    const play = await req('POST', `/api/sets/${setId}/play`);
    check(play.json?.playCount === 2, 'počítadlo her roste');

    const stats = await req('GET', '/api/stats');
    check(stats.json?.totals?.total_plays >= 2, 'statistiky započítaly hry');

    section('Validace');
    const badSet = await req('POST', '/api/sets', { jar: 'user', body: {
      title: 'X', topic: 'T', grade: 'G', questions: [] } });
    check(badSet.status === 400, 'vadná sada je odmítnuta');

    const badJson = await fetch(BASE + '/api/sets', { method: 'POST',
      headers: { 'Content-Type': 'application/json' }, body: '{"broken":,}' });
    const bjText = await badJson.text();
    check(badJson.status === 400 && bjText.trim().startsWith('{'),
      'vadný JSON vrací JSON chybu, ne HTML');

  } catch (e) {
    bad('Neočekávaná chyba: ' + e.message);
  } finally {
    server.kill('SIGTERM');
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }

  console.log(`\n${'─'.repeat(46)}`);
  console.log(`  Prošlo: ${pass}   Selhalo: ${fail}`);
  console.log('─'.repeat(46));
  process.exit(fail ? 1 : 0);
})();
