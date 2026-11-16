// TAK BSN — enjin: keadaan & simpanan, audio, peta, lukisan dan pergerakan.
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- Bank soalan ----------
const QBANK = window.TAK_QUESTIONS;
const QBY_OWNER = {};
for (const q of QBANK) (QBY_OWNER[q.owner] = QBY_OWNER[q.owner] || []).push(q);
for (const k in QBY_OWNER) QBY_OWNER[k].sort((a, b) => a.n - b.n);

// ---------- Keadaan & simpanan ----------
const SAVE_KEY = 'takbsn_save_v1';
function newState() {
  return {
    v: 1, name: '', prologue: 0, magic: false, quests: {}, tracked: null, bosses: {},
    wallet: 0, savings: 0, maxSavings: 0, inv: {}, equip: { hat: null }, badges: {},
    subs: { t: 0, c: 0 }, registered: false, registeredAt: null, endingSeen: false,
    area: 'hub', px: null, py: null, ledger: [], sideRuns: 0,
    settings: { music: 0.5, sfx: 0.7, mute: false, reduce: false },
  };
}
let S = newState();
let saveEnabled = false; // hanya simpan selepas permainan bermula/diteruskan
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    const s = Object.assign(newState(), d);
    s.settings = Object.assign(newState().settings, d.settings || {});
    s.subs = Object.assign({ t: 0, c: 0 }, d.subs || {});
    return s;
  } catch (e) { return null; }
}
function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
function save() {
  if (!saveEnabled) return;
  if (world.player) { S.px = world.player.x; S.py = world.player.y; }
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storan tidak tersedia */ }
}
function wipeSave() { saveEnabled = false; try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

// Ledger & token (idempoten melalui ref unik)
function ledger(type, amount, ref) {
  const id = type + ':' + ref;
  if (S.ledger.some(l => l.id === id) && /reward$/.test(type) && type !== 'side_quest_reward') return false;
  S.ledger.push({ id, type, amount, at: Date.now() });
  if (S.ledger.length > 200) S.ledger.splice(0, S.ledger.length - 200);
  return true;
}
function credit(amount, type, ref) {
  if (!ledger(type, amount, ref)) return false;
  S.wallet += amount;
  save(); hudUpdate(); sfx('coin'); toast(`+${amount} token ke dompet`);
  return true;
}
function recordSub(ok) {
  S.subs.t++; if (ok) S.subs.c++;
  if (S.subs.c >= 20) award('bijak');
}
function award(id) {
  if (S.badges[id]) return;
  S.badges[id] = Date.now();
  const b = BADGES.find(x => x.id === id);
  setTimeout(() => { toast(`🏅 Lencana baharu: ${b.name}`); sfx('badge'); }, 500);
  save();
}
const pagesRestored = () => [1, 2, 3, 4, 5].filter(n => S.bosses[n] && S.bosses[n].won).length;
const stageUnlocked = n => n === 1 || !!(S.bosses[n - 1] && S.bosses[n - 1].won);
const questStatus = id => {
  const q = QUEST_BY_ID[id];
  if (!stageUnlocked(q.stage)) return 'dikunci';
  const st = S.quests[id];
  if (!st) return 'tersedia';
  return st.status === 'done' ? 'selesai' : 'dalam_proses';
};
const stageQuests = n => QUESTS.filter(q => q.stage === n);
const stageDone = n => stageQuests(n).every(q => questStatus(q.id) === 'selesai');
const mainDone = () => QUESTS.filter(q => questStatus(q.id) === 'selesai').length;
function currentStage() { let s = 1; for (let n = 2; n <= 5; n++) if (stageUnlocked(n)) s = n; return s; }

// ---------- Audio (Web Audio, tanpa suara) ----------
const AUD = { ctx: null, master: null, mus: null, fx: null, theme: null, step: 0, next: 0, timer: null, pat: {} };
const MUSIC = {
  hub:    { bpm: 96,  root: 60, scale: [0, 2, 4, 7, 9], wave: 'triangle', seed: 3 },
  school: { bpm: 104, root: 62, scale: [0, 2, 4, 7, 9], wave: 'square', seed: 5, soft: true },
  forest: { bpm: 84,  root: 57, scale: [0, 3, 5, 7, 10], wave: 'sine', seed: 9 },
  castle: { bpm: 92,  root: 55, scale: [0, 2, 3, 7, 8], wave: 'triangle', seed: 13 },
  arena:  { bpm: 100, root: 53, scale: [0, 3, 5, 6, 7, 10], wave: 'sawtooth', seed: 21, soft: true },
  upsi:   { bpm: 88,  root: 60, scale: [0, 2, 4, 5, 7, 9, 11], wave: 'triangle', seed: 31 },
  boss1:  { bpm: 132, root: 57, scale: [0, 3, 5, 7, 10], wave: 'square', seed: 41, soft: true, boss: true },
  boss2:  { bpm: 140, root: 55, scale: [0, 2, 3, 7, 8], wave: 'square', seed: 43, soft: true, boss: true },
  boss3:  { bpm: 128, root: 52, scale: [0, 3, 5, 6, 7, 10], wave: 'sawtooth', seed: 47, soft: true, boss: true },
  boss4:  { bpm: 120, root: 50, scale: [0, 1, 5, 7, 8], wave: 'square', seed: 53, soft: true, boss: true },
  boss5:  { bpm: 144, root: 48, scale: [0, 3, 5, 6, 7, 10], wave: 'sawtooth', seed: 59, soft: true, boss: true },
  win:    { bpm: 110, root: 64, scale: [0, 2, 4, 7, 9, 12], wave: 'triangle', seed: 61 },
};
function audioInit() {
  if (AUD.ctx) { if (AUD.ctx.state === 'suspended') AUD.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  AUD.ctx = new AC();
  AUD.master = AUD.ctx.createGain(); AUD.master.connect(AUD.ctx.destination);
  AUD.mus = AUD.ctx.createGain(); AUD.mus.connect(AUD.master);
  AUD.fx = AUD.ctx.createGain(); AUD.fx.connect(AUD.master);
  audioApply();
  AUD.timer = setInterval(audioTick, 60);
}
function audioApply() {
  if (!AUD.ctx) return;
  const st = S.settings;
  AUD.master.gain.value = st.mute ? 0 : 1;
  AUD.mus.gain.value = st.music * 0.22;
  AUD.fx.gain.value = st.sfx * 0.5;
}
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function pattern(name) {
  if (AUD.pat[name]) return AUD.pat[name];
  const m = MUSIC[name], r = rng(m.seed), mel = []; let deg = 2;
  for (let i = 0; i < 32; i++) {
    deg = clamp(deg + Math.floor(r() * 5) - 2, 0, m.scale.length * 2 - 1);
    mel.push(r() < (m.boss ? 0.85 : 0.62) ? deg : null);
  }
  return (AUD.pat[name] = mel);
}
function playMusic(name) {
  if (AUD.theme === name) return;
  AUD.theme = name; AUD.step = 0; if (AUD.ctx) AUD.next = AUD.ctx.currentTime + 0.1;
}
function note(freq, t, dur, wave, gain, dest) {
  const o = AUD.ctx.createOscillator(), g = AUD.ctx.createGain();
  o.type = wave; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function audioTick() {
  if (!AUD.ctx || !AUD.theme || S.settings.mute || S.settings.music <= 0) return;
  const m = MUSIC[AUD.theme]; if (!m) return;
  const spb = 60 / m.bpm / 2, mel = pattern(AUD.theme);
  if (AUD.next < AUD.ctx.currentTime) AUD.next = AUD.ctx.currentTime + 0.05;
  while (AUD.next < AUD.ctx.currentTime + 0.25) {
    const i = AUD.step % 32, d = mel[i], t = AUD.next;
    if (d !== null) {
      const oct = Math.floor(d / m.scale.length), deg = m.scale[d % m.scale.length];
      note(mtof(m.root + 12 + deg + oct * 12), t, spb * 1.6, m.wave, m.soft ? 0.18 : 0.32, AUD.mus);
    }
    if (i % 4 === 0) {
      const bassDeg = [0, 0, 3, 4, 0, 2, 3, 4][Math.floor(i / 4) % 8] % m.scale.length;
      note(mtof(m.root - 12 + m.scale[bassDeg]), t, spb * 3.5, 'triangle', 0.4, AUD.mus);
    }
    if (m.boss && i % 2 === 0) note(90 + (i % 8 === 0 ? 0 : 40), t, 0.06, 'square', 0.12, AUD.mus);
    AUD.step++; AUD.next += spb;
  }
}
function sfx(type) {
  if (!AUD.ctx || S.settings.mute) return;
  const t = AUD.ctx.currentTime, F = AUD.fx;
  const seq = (notes, dur, wave = 'triangle', g = 0.5) => notes.forEach((n, i) => note(mtof(n), t + i * dur, dur * 1.8, wave, g, F));
  switch (type) {
    case 'ok': seq([72, 76, 79], 0.07); break;
    case 'bad': seq([55, 52], 0.12, 'sine', 0.4); break;
    case 'coin': seq([84, 91], 0.06, 'square', 0.18); break;
    case 'click': seq([79], 0.03, 'square', 0.12); break;
    case 'talk': seq([74], 0.03, 'triangle', 0.2); break;
    case 'page': seq([60, 64, 67, 72, 76, 79, 84], 0.09); break;
    case 'badge': seq([76, 79, 83, 88], 0.08); break;
    case 'hit': seq([45, 40], 0.08, 'sawtooth', 0.3); break;
    case 'hurt': seq([50, 46, 43], 0.09, 'square', 0.25); break;
    case 'win': seq([67, 72, 76, 79, 84, 88], 0.12); break;
    case 'lose': seq([60, 57, 53, 48], 0.18, 'sine', 0.4); break;
    case 'magic': seq([72, 79, 84, 91, 96], 0.07, 'sine', 0.35); break;
    case 'shoot': seq([84, 79, 88], 0.04, 'square', 0.16); break;
    case 'pop': seq([88, 96], 0.03, 'sine', 0.3); break;
    case 'whoosh': seq([60, 64], 0.05, 'sawtooth', 0.08); break;
    case 'boom': seq([40, 36, 33], 0.1, 'sawtooth', 0.3); break;
    case 'combo': seq([79, 84, 88, 91], 0.05, 'square', 0.15); break;
  }
}

// ---------- Utiliti UI kecil ----------
function toast(msg) { const d = document.createElement('div'); d.textContent = msg; $('#toast').appendChild(d); setTimeout(() => d.remove(), 2900); }
function flash(color = '#fff', ms = 350) { const f = $('#flash'); f.style.background = color; f.style.opacity = '0.85'; setTimeout(() => (f.style.opacity = '0'), ms); }
function shuffle(a, r = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
