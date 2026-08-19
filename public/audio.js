/* ============================================================================
 *  FFAudio — zvukový engine pro Family Feud / 5 proti 5
 *
 *  Všechny zvuky se syntetizují v prohlížeči přes WebAudio API, takže projekt
 *  nepotřebuje žádné externí zvukové soubory a nic se nestahuje.
 *
 *  Znělky jsou PŮVODNÍ motivy v žánru televizních soutěží. Nejde o přepis
 *  znělky pořadu Family Feud ani žádné jiné chráněné hudby.
 * ==========================================================================*/

const FFAudio = (() => {
  let ctx = null, master = null, dry = null, wet = null, comp = null;
  let volume = 0.7, muted = false, ready = false;

  // ---------------------------------------------------------------- init ---
  function init() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();

    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 24;
    comp.ratio.value = 3.5;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;

    master = ctx.createGain();
    master.gain.value = volume;

    // dozvuk (studiová akustika) – impulsní odezva z tlumeného šumu
    const conv = ctx.createConvolver();
    conv.buffer = impulse(1.7, 2.6);
    wet = ctx.createGain(); wet.gain.value = 0.22;
    dry = ctx.createGain(); dry.gain.value = 1.0;

    dry.connect(comp);
    wet.connect(conv); conv.connect(comp);
    comp.connect(master);
    master.connect(ctx.destination);

    ready = true;
    return ctx;
  }

  function impulse(dur, decay) {
    const rate = ctx.sampleRate, len = Math.floor(rate * dur);
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  function noiseBuf(dur) {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // routing hlasu do dry + wet větve
  function bus(send = 0.3) {
    const g = ctx.createGain();
    const s = ctx.createGain(); s.gain.value = send;
    g.connect(dry); g.connect(s); s.connect(wet);
    return g;
  }

  // -------------------------------------------------------------- hlasy ---

  /** Žesťový hlas – stack rozladěných pil s filtrační obálkou. Nese znělky. */
  function brass(freq, t, dur, gain = 0.22, send = 0.3) {
    const out = bus(send);
    const amp = ctx.createGain();
    const flt = ctx.createBiquadFilter();
    flt.type = 'lowpass';
    flt.Q.value = 6;
    flt.frequency.setValueAtTime(freq * 1.2, t);
    flt.frequency.linearRampToValueAtTime(freq * 6, t + 0.06);
    flt.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.6, 200), t + dur);

    [-8, 0, 7].forEach(cents => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      o.detune.value = cents;
      o.connect(flt);
      o.start(t); o.stop(t + dur + 0.08);
    });

    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(gain, t + 0.022);
    amp.gain.setValueAtTime(gain, t + Math.max(0.05, dur * 0.65));
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.06);

    flt.connect(amp); amp.connect(out);
  }

  /** Zvonkohra / „ding" – sinus s harmonickou, rychlý doznik. */
  function bell(freq, t, dur = 0.9, gain = 0.3) {
    const out = bus(0.45);
    [[1, gain], [2.01, gain * 0.38], [3.02, gain * 0.14]].forEach(([m, g]) => {
      const o = ctx.createOscillator(), a = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq * m;
      a.gain.setValueAtTime(0, t);
      a.gain.linearRampToValueAtTime(g, t + 0.008);
      a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(a); a.connect(out);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }

  /** Basová linka pod znělkou. */
  function bass(freq, t, dur, gain = 0.3) {
    const out = bus(0.12);
    const o = ctx.createOscillator(), a = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = freq;
    f.type = 'lowpass'; f.frequency.value = 420;
    a.gain.setValueAtTime(0, t);
    a.gain.linearRampToValueAtTime(gain, t + 0.02);
    a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f); f.connect(a); a.connect(out);
    o.start(t); o.stop(t + dur + 0.05);
  }

  /** Činel / crash z filtrovaného šumu. */
  function cymbal(t, dur = 1.1, gain = 0.16) {
    const out = bus(0.5);
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(dur + 0.1);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5200;
    const a = ctx.createGain();
    a.gain.setValueAtTime(gain, t);
    a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(hp); hp.connect(a); a.connect(out);
    src.start(t); src.stop(t + dur + 0.05);
  }

  /** Potlesk – pásmově filtrovaný šum s náhodnými špičkami. */
  function applause(t, dur = 2.2, gain = 0.2) {
    const out = bus(0.5);
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(dur + 0.2);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = 1900; bp.Q.value = 0.7;
    const a = ctx.createGain();
    a.gain.setValueAtTime(0.0001, t);
    a.gain.exponentialRampToValueAtTime(gain, t + 0.18);
    a.gain.setValueAtTime(gain, t + dur * 0.55);
    a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    // drobné „tleskání" navrch
    for (let i = 0; i < 26; i++) {
      const tt = t + 0.05 + Math.random() * dur * 0.8;
      const c = ctx.createBufferSource(); c.buffer = noiseBuf(0.03);
      const ch = ctx.createBiquadFilter(); ch.type = 'highpass'; ch.frequency.value = 2600;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.05 + Math.random() * 0.05, tt);
      cg.gain.exponentialRampToValueAtTime(0.0001, tt + 0.05);
      c.connect(ch); ch.connect(cg); cg.connect(out);
      c.start(tt); c.stop(tt + 0.06);
    }
    src.connect(bp); bp.connect(a); a.connect(out);
    src.start(t); src.stop(t + dur + 0.1);
  }

  /** Bzučák pro chybu – rozladěné pily s poklesem výšky. */
  function buzzer(t, dur = 0.75) {
    const out = bus(0.18);
    const a = ctx.createGain();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1300;
    [96, 101, 148].forEach((hz, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'square' : 'sawtooth';
      o.frequency.setValueAtTime(hz, t);
      o.frequency.linearRampToValueAtTime(hz * 0.82, t + dur);
      o.connect(f);
      o.start(t); o.stop(t + dur + 0.04);
    });
    a.gain.setValueAtTime(0, t);
    a.gain.linearRampToValueAtTime(0.3, t + 0.012);
    a.gain.setValueAtTime(0.3, t + dur * 0.8);
    a.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.03);
    f.connect(a); a.connect(out);
  }

  /** Vzestupný „whoosh" z filtrovaného šumu. */
  function whoosh(t, dur = 0.45, up = true) {
    const out = bus(0.35);
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(dur + 0.1);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(up ? 400 : 3200, t);
    bp.frequency.exponentialRampToValueAtTime(up ? 3400 : 380, t + dur);
    const a = ctx.createGain();
    a.gain.setValueAtTime(0.0001, t);
    a.gain.exponentialRampToValueAtTime(0.16, t + dur * 0.6);
    a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(a); a.connect(out);
    src.start(t); src.stop(t + dur + 0.05);
  }

  // ------------------------------------------------------- noty a znělky ---
  // Půltónový posun od A4 = 440 Hz
  const N = (semi) => 440 * Math.pow(2, semi / 12);
  const NOTE = {
    D3: N(-19), A3: N(-12), D4: N(-7), E4: N(-5), Fs4: N(-3), G4: N(-2),
    A4: N(0), B4: N(2), Cs5: N(4), D5: N(5), E5: N(7), Fs5: N(9),
    G5: N(10), A5: N(12), D6: N(17),
    D2: N(-31), G2: N(-26), A2: N(-24), Bb4: N(1), C5: N(3), F5: N(8),
  };

  /* ---- ÚVODNÍ ZNĚLKA (původní motiv, ~3,4 s) ----------------------------
     Sedmitónová žesťová fanfára v D dur s basem a závěrečným akordem. */
  function theme(t0) {
    const B = 0.30; // délka doby
    const mel = [
      [NOTE.D5,  0,   0.75],
      [NOTE.A4,  0.75, 0.5],
      [NOTE.D5,  1.25, 0.5],
      [NOTE.Fs5, 1.75, 0.75],
      [NOTE.E5,  2.5,  0.5],
      [NOTE.D5,  3.0,  0.5],
      [NOTE.A5,  3.5,  1.6],
    ];
    mel.forEach(([f, b, len]) => brass(f, t0 + b * B, len * B, 0.2));

    // harmonie o tercii níž
    [[NOTE.Fs4, 0, 0.75], [NOTE.D4, 0.75, 0.5], [NOTE.Fs4, 1.25, 0.5],
     [NOTE.A4, 1.75, 0.75], [NOTE.G4, 2.5, 0.5], [NOTE.Fs4, 3.0, 0.5],
     [NOTE.Fs5, 3.5, 1.6]]
      .forEach(([f, b, len]) => brass(f, t0 + b * B, len * B, 0.12, 0.35));

    // bas
    [[NOTE.D2, 0, 1.25], [NOTE.A2, 1.25, 1.25], [NOTE.G2, 2.5, 1.0], [NOTE.D2, 3.5, 1.6]]
      .forEach(([f, b, len]) => bass(f, t0 + b * B, len * B, 0.34));

    cymbal(t0, 0.9, 0.12);
    cymbal(t0 + 3.5 * B, 1.6, 0.18);
    bell(NOTE.D6, t0 + 3.5 * B, 1.4, 0.14);
  }

  /* ---- ZNĚLKA NA ZAČÁTKU KOLA (krátká, ~1,2 s) ---- */
  function roundStart(t0) {
    const B = 0.16;
    [[NOTE.A4, 0, 1], [NOTE.D5, 1, 1], [NOTE.Fs5, 2, 2]]
      .forEach(([f, b, l]) => brass(f, t0 + b * B, l * B, 0.17));
    bass(NOTE.D3, t0, 0.55, 0.24);
    whoosh(t0, 0.4, true);
  }

  /* ---- SPRÁVNÁ ODPOVĚĎ ---- */
  function reveal(t0) {
    bell(NOTE.D5, t0, 0.55, 0.26);
    bell(NOTE.A5, t0 + 0.055, 0.7, 0.2);
    brass(NOTE.D4, t0, 0.22, 0.1, 0.2);
  }

  /* ---- ODHALENÍ ODPOVĚDI Č. 1 (top answer) – o něco slavnostnější ---- */
  function revealTop(t0) {
    bell(NOTE.D5, t0, 0.6, 0.26);
    bell(NOTE.Fs5, t0 + 0.06, 0.7, 0.22);
    bell(NOTE.A5, t0 + 0.12, 0.9, 0.22);
    cymbal(t0, 0.7, 0.1);
  }

  /* ---- CHYBA ---- */
  function strike(t0) {
    buzzer(t0, 0.7);
    whoosh(t0, 0.3, false);
  }

  /* ---- TŘETÍ CHYBA – kolo končí ---- */
  function strikeOut(t0) {
    buzzer(t0, 0.55);
    buzzer(t0 + 0.42, 0.9);
    [NOTE.G4, NOTE.Fs4, NOTE.D4].forEach((f, i) =>
      brass(f, t0 + 0.9 + i * 0.16, 0.3, 0.14));
  }

  /* ---- PŘIPSÁNÍ BODŮ TÝMU – vzestupná fanfára + potlesk ---- */
  function score(t0) {
    const B = 0.13;
    [[NOTE.D5, 0, 1], [NOTE.E5, 1, 1], [NOTE.Fs5, 2, 1], [NOTE.A5, 3, 3]]
      .forEach(([f, b, l]) => brass(f, t0 + b * B, l * B, 0.2));
    bass(NOTE.D3, t0, 0.8, 0.3);
    cymbal(t0 + 3 * B, 1.2, 0.14);
    applause(t0 + 3 * B, 1.8, 0.16);
  }

  /* ---- VÍTĚZ HRY – velká fanfára ---- */
  function win(t0) {
    const B = 0.2;
    [[NOTE.D5, 0, 1], [NOTE.D5, 1, 0.5], [NOTE.E5, 1.5, 0.5],
     [NOTE.Fs5, 2, 1], [NOTE.A5, 3, 1], [NOTE.Fs5, 4, 0.5],
     [NOTE.A5, 4.5, 2.5]]
      .forEach(([f, b, l]) => brass(f, t0 + b * B, l * B, 0.2));
    [[NOTE.A4, 0, 1], [NOTE.A4, 1, 0.5], [NOTE.B4, 1.5, 0.5],
     [NOTE.D5, 2, 1], [NOTE.Fs5, 3, 1], [NOTE.D5, 4, 0.5], [NOTE.D5, 4.5, 2.5]]
      .forEach(([f, b, l]) => brass(f, t0 + b * B, l * B, 0.11, 0.4));
    [[NOTE.D2, 0, 2], [NOTE.A2, 2, 1], [NOTE.D2, 3, 1], [NOTE.D2, 4, 2.5]]
      .forEach(([f, b, l]) => bass(f, t0 + b * B, l * B, 0.32));
    cymbal(t0, 1.0, 0.13);
    cymbal(t0 + 4.5 * B, 1.8, 0.2);
    bell(NOTE.D6, t0 + 4.5 * B, 1.6, 0.15);
    applause(t0 + 4.4 * B, 3.0, 0.22);
  }

  /* ---- NOVÁ OTÁZKA ---- */
  function newq(t0) {
    whoosh(t0, 0.35, true);
    bell(NOTE.A4, t0 + 0.14, 0.4, 0.16);
    bell(NOTE.D5, t0 + 0.22, 0.5, 0.14);
  }

  /* ---- ODPOČET (tik) ---- */
  function tick(t0) { bell(NOTE.A5, t0, 0.12, 0.14); }

  // ------------------------------------------------------------- veřejné ---
  const SOUNDS = {
    theme, roundStart, reveal, revealTop, strike, strikeOut,
    score, win, newq, tick, applause: (t) => applause(t, 2.2, 0.22),
  };

  function play(name, delay = 0) {
    if (muted) return;
    if (!init()) return;
    if (ctx.state === 'suspended') ctx.resume();
    const fn = SOUNDS[name];
    if (!fn) return;
    try { fn(ctx.currentTime + 0.02 + delay); } catch (e) { console.warn('FFAudio', e); }
  }

  function unlock() {
    if (!init()) return false;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx.state === 'running';
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.02);
  }

  function setMuted(m) {
    muted = !!m;
    if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.02);
  }

  return {
    play, unlock, setVolume, setMuted,
    get isReady() { return ready && ctx?.state === 'running'; },
    get names() { return Object.keys(SOUNDS); },
  };
})();
