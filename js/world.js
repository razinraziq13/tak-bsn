// TAK BSN — dunia penerokaan: peta grafik asal, topeng perlanggaran, sprite watak dan lukisan.
'use strict';

// ---------- Imej ----------
const IMG = {};
function img(src) { if (!IMG[src]) { const i = new Image(); i.src = src; IMG[src] = i; } return IMG[src]; }
const spr = name => img('assets/sprite/' + name + '.png');
function preloadAll() {
  for (const k in SPRITES) { const s = SPRITES[k]; [...s.idle, ...(s.walk || []), ...(s.back ? [s.back] : [])].forEach(spr); }
  for (const id in AREAS) if (AREAS[id].img) img(AREAS[id].img);
  for (let n = 1; n <= 5; n++) { img(`assets/boss/boss${n}.png`); img(`assets/bg/stage${n}.jpg`); }
  Object.values(PORTRAITS).forEach(img);
}
const ready = i => i && i.complete && i.naturalWidth > 0;

// ---------- Input ----------
const input = { keys: {}, joy: { x: 0, y: 0, on: false } };
const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
function moveVec() {
  const k = input.keys; let x = 0, y = 0;
  if (k.ArrowLeft || k.a) x -= 1; if (k.ArrowRight || k.d) x += 1;
  if (k.ArrowUp || k.w) y -= 1; if (k.ArrowDown || k.s) y += 1;
  if (input.joy.on) { x = input.joy.x; y = input.joy.y; }
  const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
  return { x, y, len: Math.min(1, l) };
}

// ---------- Peta & perlanggaran ----------
const MAPS = {};
function pathShape(g, s) {
  g.beginPath();
  if (typeof s[0] === 'number') g.rect(s[0], s[1], s[2], s[3]);
  else if (s.c) g.arc(s.c[0], s.c[1], s.c[2], 0, Math.PI * 2);
  else if (s.e) g.ellipse(s.e[0], s.e[1], s.e[2], s.e[3], 0, 0, Math.PI * 2);
  else { g.moveTo(s[0][0], s[0][1]); for (const p of s.slice(1)) g.lineTo(p[0], p[1]); g.closePath(); }
  g.fill();
}
function buildMap(id) {
  if (MAPS[id]) return MAPS[id];
  const a = AREAS[id];
  let bg, extra = [], pixel = false;
  if (a.paint) { const p = PAINT[a.paint](); bg = p.canvas; extra = p.blocks; pixel = true; } else bg = img(a.img);
  const mw = Math.ceil(a.w / 4), mh = Math.ceil(a.h / 4);
  const c = document.createElement('canvas'); c.width = mw; c.height = mh;
  const g = c.getContext('2d'); g.scale(0.25, 0.25); g.fillStyle = '#fff';
  for (const s of a.walk) pathShape(g, s);
  g.globalCompositeOperation = 'destination-out';
  for (const s of a.block.concat(extra)) pathShape(g, s);
  const d = g.getImageData(0, 0, mw, mh).data, mask = new Uint8Array(mw * mh);
  for (let i = 0; i < mask.length; i++) mask[i] = d[i * 4 + 3] > 127 ? 1 : 0;
  return (MAPS[id] = { bg, mask, mw, mh, pixel });
}
function walkable(x, y) {
  const m = world.map; if (!m) return false;
  const i = Math.floor(x / 4), j = Math.floor(y / 4);
  if (i < 0 || j < 0 || i >= m.mw || j >= m.mh) return false;
  return m.mask[j * m.mw + i] === 1;
}
const SOLID_LOOKS = new Set(['sign', 'lectern', 'portal', 'bus', 'chat', 'desk', 'panel', 'crystal', 'mirror']);
function blocked(x, y) {
  for (const [dx, dy] of [[-10, -4], [10, -4], [-10, 4], [10, 4]]) if (!walkable(x + dx, y + dy)) return true;
  for (const p of world.points) {
    if (p.type !== 'npc' && !SOLID_LOOKS.has(p.look)) continue;
    if (Math.abs(x - p.x) < 24 && Math.abs(y - p.y) < 12) return true;
  }
  return false;
}

// ---------- Dunia ----------
const world = { areaId: null, area: null, map: null, points: [], player: null, aisyah: null, trail: [], cam: { x: 0, y: 0 }, t: 0, near: null, fx: [] };
function enterArea(id, at) {
  const a = AREAS[id];
  world.areaId = id; world.area = a; world.map = buildMap(id); resize();
  world.points = a.points.map(p => Object.assign({}, p));
  let x = at && at.px ? at.px : a.spawn.x, y = at && at.py ? at.py : a.spawn.y;
  if (!walkable(x, y)) { x = a.spawn.x; y = a.spawn.y; }
  world.player = { x, y, dir: 'down', moving: false, anim: 0, idleT: 0 };
  world.aisyah = { x: x - 30, y: y + 6, dir: 'down', moving: false, anim: 0 };
  world.trail = []; world.fx = [];
  S.area = id;
  playMusic(a.music);
  hudUpdate(); save();
}
function updateWorld(dt) {
  world.t += dt;
  const p = world.player; if (!p) return;
  const v = UI.mode === 'play' ? moveVec() : { x: 0, y: 0, len: 0 };
  p.moving = v.len > 0.15;
  if (p.moving) {
    const sp = 175 * dt * v.len, nx = p.x + v.x / (v.len || 1) * sp, ny = p.y + v.y / (v.len || 1) * sp;
    if (!blocked(nx, p.y)) p.x = nx;
    if (!blocked(p.x, ny)) p.y = ny;
    p.dir = Math.abs(v.x) > Math.abs(v.y) ? (v.x < 0 ? 'left' : 'right') : (v.y < 0 ? 'up' : 'down');
    p.anim += dt * 9; p.idleT = 0;
    const last = world.trail[world.trail.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 3) world.trail.push({ x: p.x, y: p.y, dir: p.dir });
    if (world.trail.length > 200) world.trail.shift();
  } else p.idleT += dt;
  const a = world.aisyah, idx = world.trail.length - 16;
  if (idx >= 0) {
    const tp = world.trail[idx];
    a.moving = Math.hypot(tp.x - a.x, tp.y - a.y) > 0.6;
    if (a.moving) { a.dir = tp.dir; a.anim += dt * 9; }
    a.x = tp.x; a.y = tp.y;
  } else a.moving = false;
  if (Math.hypot(a.x - p.x, a.y - p.y) > 300) { a.x = p.x - 30; a.y = p.y + 6; world.trail = []; }
  let best = null, bd = 70;
  for (const q of world.points) { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = q; } }
  world.near = best;
  // zarah suasana
  const th = world.areaId;
  if ((th === 'forest' || th === 'arena' || (th === 'hub' && S.magic && !(S.bosses[1] && S.bosses[1].won))) && Math.random() < dt * 6) {
    world.fx.push({ k: th === 'hub' ? 'word' : 'mote', x: world.cam.x + Math.random() * view.w, y: world.cam.y + view.h + 10, vx: (Math.random() - 0.5) * 20, vy: -20 - Math.random() * 30, t: 6, txt: Math.random() < 0.5 ? 'tidak?' : 'bukan?' });
  }
  for (const f of world.fx) { f.x += (f.vx || 0) * dt; f.y += (f.vy || 0) * dt; f.t -= dt; if (f.g) f.vy += f.g * dt; }
  world.fx = world.fx.filter(f => f.t > 0);
}

// ---------- Kanvas ----------
const cv = $('#game'), ctx = cv.getContext('2d');
const view = { w: 0, h: 0, scale: 1, dpr: 1 };
function resize() {
  view.dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.floor(innerWidth * view.dpr); cv.height = Math.floor(innerHeight * view.dpr);
  const a = world.area || { w: 1672, h: 941 };
  view.scale = Math.max(innerWidth / a.w, innerHeight / a.h, Math.min(innerWidth / 760, innerHeight / 440));
  view.w = innerWidth / view.scale; view.h = innerHeight / view.scale;
}
addEventListener('resize', resize); resize();
function rr(G, x, y, w, h, r) { G.beginPath(); if (G.roundRect) G.roundRect(x, y, w, h, r); else G.rect(x, y, w, h); }
function shade(hex, amt) {
  let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const n = parseInt(c.slice(0, 6), 16), f = v => clamp(Math.round(v + amt), 0, 255);
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

// Lukis watak sprite (helaian asal). opts: {flip, h, alpha, hat, scale}
function drawHero(G, who, x, y, dir, moving, anim, opts = {}) {
  const S0 = SPRITES[who]; if (!S0) return;
  const ref = spr(S0.idle[0]); if (!ready(ref)) return;
  const k = (opts.h || S0.h) / ref.naturalHeight * (opts.scale || 1);
  let im, flip = false, bob = 0;
  if (dir === 'up' && S0.back) { im = spr(S0.back); bob = moving ? Math.abs(Math.sin(anim)) * 3 : 0; }
  else if ((dir === 'left' || dir === 'right') && S0.walk && moving) { im = spr(S0.walk[Math.floor(anim * 0.9) % 4]); flip = dir === 'left'; }
  else if ((dir === 'left' || dir === 'right') && S0.walk) { im = spr(S0.walk[1]); flip = dir === 'left'; }
  else { im = spr(S0.idle[S0.idle.length > 1 ? Math.floor((world.t + (opts.phase || 0)) * 1.3) % S0.idle.length : 0]); bob = moving ? Math.abs(Math.sin(anim)) * 3 : 0; }
  if (!ready(im)) return;
  const w = im.naturalWidth * k, h = im.naturalHeight * k;
  G.save();
  G.globalAlpha = opts.alpha == null ? 1 : opts.alpha;
  G.fillStyle = 'rgba(0,0,0,.28)'; G.beginPath(); G.ellipse(x, y, w * 0.42, 6 * (opts.scale || 1), 0, 0, Math.PI * 2); G.fill();
  G.translate(x, y - bob);
  if (flip) G.scale(-1, 1);
  G.imageSmoothingEnabled = true;
  G.drawImage(im, -w / 2, -h + 3, w, h);
  if (opts.hat && dir !== 'up') {
    const hy = -h + 4, hw = w * 0.62;
    G.fillStyle = opts.hat; G.beginPath(); G.ellipse(0, hy + 6, hw / 2, 7, 0, Math.PI, 0); G.fill();
    G.fillStyle = shade(opts.hat, -40); G.fillRect(dir === 'down' ? -hw / 2 : 0, hy + 5, dir === 'down' ? hw : hw * 0.75, 3);
  }
  G.restore();
}

// Watak prosedural (Pegawai Pendaftaran — tiada helaian sprite asal)
function drawChar(G, x, y, st, sc = 1.8) {
  G.save(); G.translate(x, y); G.scale(sc, sc);
  G.fillStyle = 'rgba(0,0,0,.25)'; G.beginPath(); G.ellipse(0, 0, 10, 4, 0, 0, 7); G.fill();
  G.fillStyle = st.legs; G.fillRect(-6, -15, 5, 13); G.fillRect(1, -15, 5, 13); G.fillStyle = '#222'; G.fillRect(-6, -3, 5, 3); G.fillRect(1, -3, 5, 3);
  G.fillStyle = st.shirt; rr(G, -9, -31, 18, 17, 4); G.fill(); G.fillRect(-12, -29, 4, 11); G.fillRect(8, -29, 4, 11);
  G.fillStyle = '#fff'; G.fillRect(-3, -31, 6, 5); G.fillStyle = st.tie; G.fillRect(-1.5, -30, 3, 10);
  G.fillStyle = st.skin; G.fillRect(-12, -19, 4, 3); G.fillRect(8, -19, 4, 3); rr(G, -9, -48, 18, 17, 6); G.fill();
  G.fillStyle = st.hair; rr(G, -10, -51, 20, 9, 5); G.fill(); G.fillRect(-10, -46, 3, 6); G.fillRect(7, -46, 3, 6);
  G.fillStyle = '#1b1622'; G.fillRect(-5, -40, 3, 4); G.fillRect(2, -40, 3, 4);
  G.strokeStyle = '#222'; G.lineWidth = 1; G.strokeRect(-6.5, -41.5, 5, 6); G.strokeRect(1.5, -41.5, 5, 6);
  G.fillStyle = '#c9a43a'; G.fillRect(4, -28, 4, 5);
  G.restore();
}

// Objek interaktif (dilukis di atas peta)
function drawObject(G, p, t) {
  const x = p.x, y = p.y;
  const shadow = (w = 18) => { G.fillStyle = 'rgba(0,0,0,.25)'; G.beginPath(); G.ellipse(x, y, w, 6, 0, 0, 7); G.fill(); };
  switch (p.look) {
    case 'sign': {
      shadow(14); G.fillStyle = '#5a3a22'; G.fillRect(x - 3, y - 34, 6, 34);
      G.fillStyle = '#3a2412'; rr(G, x - 27, y - 62, 54, 32, 4); G.fill(); G.fillStyle = '#c99a5b'; rr(G, x - 25, y - 60, 50, 28, 3); G.fill();
      G.fillStyle = '#8a6236'; G.fillRect(x - 19, y - 51, 38, 3); G.fillRect(x - 19, y - 43, 28, 3);
      const glitch = (p.id === 'papan1' && S.magic && questStatus('S1-M1') !== 'selesai') || (p.id === 'tamanistana' && questStatus('S4-M2') === 'tersedia');
      if (glitch) { G.fillStyle = `rgba(185,140,255,${0.35 + 0.35 * Math.sin(t * 6)})`; G.fillRect(x - 25, y - 60, 50, 28); G.fillStyle = '#fff'; G.font = '900 10px Nunito'; G.textAlign = 'center'; G.fillText('tidak? bukan?', x, y - 42); }
      break;
    }
    case 'lectern': {
      shadow(16); G.fillStyle = '#4a2c18'; G.fillRect(x - 4, y - 30, 8, 30); G.fillStyle = '#6b4226'; G.beginPath(); G.moveTo(x - 22, y - 34); G.lineTo(x + 22, y - 34); G.lineTo(x + 16, y - 46); G.lineTo(x - 16, y - 46); G.fill();
      G.fillStyle = '#f5ecd0'; G.fillRect(x - 15, y - 52, 14, 9); G.fillRect(x + 1, y - 52, 14, 9); G.fillStyle = '#9b7a4a'; G.fillRect(x - 1, y - 52, 2, 9);
      const glow = !S.magic || questStatus('S1-M5') !== 'selesai';
      if (glow) { G.fillStyle = `rgba(255,225,120,${0.25 + 0.2 * Math.sin(t * 4)})`; G.beginPath(); G.arc(x, y - 50, 22, 0, 7); G.fill(); }
      break;
    }
    case 'bank': {
      const bx = x - 58, by = y - 96;
      G.fillStyle = 'rgba(0,0,0,.25)'; G.beginPath(); G.ellipse(x, y - 4, 64, 10, 0, 0, 7); G.fill();
      G.fillStyle = '#f3e3c2'; G.fillRect(bx + 6, by + 34, 104, 56); G.fillStyle = '#c9a670'; G.fillRect(bx + 6, by + 84, 104, 6);
      G.fillStyle = '#3a2412'; G.fillRect(bx + 4, by + 32, 108, 3); G.fillRect(bx + 4, by + 32, 3, 58); G.fillRect(bx + 109, by + 32, 3, 58);
      G.fillStyle = '#5b3a22'; G.fillRect(bx + 18, by + 52, 80, 32); G.fillStyle = '#8fd0ff'; G.fillRect(bx + 22, by + 55, 72, 14);
      G.fillStyle = '#c49a2e'; G.beginPath(); G.moveTo(bx - 6, by + 36); G.lineTo(bx + 14, by + 6); G.lineTo(bx + 102, by + 6); G.lineTo(bx + 122, by + 36); G.fill();
      G.fillStyle = '#8a6a14'; for (let k = 1; k < 4; k++) G.fillRect(bx - 4 + k * 4, by + 6 + k * 7, 120 - k * 8, 2);
      G.fillStyle = '#2a1b10'; rr(G, bx + 18, by + 10, 80, 16, 3); G.fill(); G.fillStyle = '#f2c14e'; G.font = '900 11px Nunito'; G.textAlign = 'center'; G.fillText('BANK IMPIAN', x, by + 22);
      G.fillStyle = '#f2c14e'; G.beginPath(); G.arc(x, by + 76, 7, 0, 7); G.fill(); G.fillStyle = '#7a5300'; G.fillRect(x - 1, by + 71, 2, 10);
      break;
    }
    case 'portal': {
      G.save(); G.translate(x, y);
      G.strokeStyle = `rgba(120,220,255,${0.5 + 0.3 * Math.sin(t * 3)})`; G.lineWidth = 3;
      G.beginPath(); G.ellipse(0, 0, 30, 11, 0, 0, 7); G.stroke(); G.beginPath(); G.ellipse(0, 0, 20, 7, 0, 0, 7); G.stroke();
      for (let k = 0; k < 6; k++) { const a = t * 1.5 + k; G.fillStyle = 'rgba(180,240,255,.8)'; G.fillRect(Math.cos(a) * 22, -10 - ((t * 30 + k * 13) % 50), 2, 6); }
      G.fillStyle = 'rgba(20,21,52,.85)'; rr(G, -22, 6, 44, 15, 4); G.fill(); G.fillStyle = '#8fe3ff'; G.font = '900 10px Nunito'; G.textAlign = 'center'; G.fillText('PETA', 0, 17);
      G.restore(); break;
    }
    case 'rune': {
      const n = Number(p.id.slice(-1)), open = stageUnlocked(n) && stageDone(n), won = S.bosses[n] && S.bosses[n].won;
      G.save(); G.translate(x, y);
      G.strokeStyle = won ? '#f2c14e' : open ? `rgba(220,140,255,${0.6 + 0.4 * Math.sin(t * 4)})` : 'rgba(120,110,170,.8)'; G.lineWidth = 3;
      G.beginPath(); G.ellipse(0, 0, 40, 15, 0, 0, 7); G.stroke(); G.beginPath(); G.ellipse(0, 0, 26, 10, 0, 0, 7); G.stroke();
      for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + t * (open ? 1 : 0.2); G.fillStyle = G.strokeStyle; G.fillRect(Math.cos(a) * 33 - 2, Math.sin(a) * 12.5 - 2, 4, 4); }
      if (open && !won) { const gr = G.createLinearGradient(0, 0, 0, -110); gr.addColorStop(0, 'rgba(190,110,255,.55)'); gr.addColorStop(1, 'rgba(190,110,255,0)'); G.fillStyle = gr; G.fillRect(-26, -110, 52, 110); }
      if (!open && !won) { G.font = '20px sans-serif'; G.textAlign = 'center'; G.fillText('🔒', 0, -4); }
      G.restore(); break;
    }
    case 'bus': shadow(12); G.fillStyle = '#5a5a6a'; G.fillRect(x - 3, y - 56, 6, 56); G.fillStyle = '#2f62c4'; rr(G, x - 22, y - 74, 44, 22, 5); G.fill(); G.fillStyle = '#fff'; G.font = '900 12px Nunito'; G.textAlign = 'center'; G.fillText('🚌 BAS', x, y - 58); break;
    case 'chat': {
      shadow(30); G.fillStyle = '#7a5232'; G.fillRect(x - 30, y - 28, 60, 14); G.fillStyle = '#a8723f'; G.fillRect(x - 30, y - 30, 60, 5); G.fillStyle = '#4a3020'; G.fillRect(x - 26, y - 14, 4, 14); G.fillRect(x + 22, y - 14, 4, 14);
      const b = Math.sin(t * 3) * 2; G.fillStyle = '#fff'; rr(G, x - 24, y - 70 + b, 48, 26, 8); G.fill(); G.beginPath(); G.moveTo(x - 6, y - 45 + b); G.lineTo(x + 2, y - 36 + b); G.lineTo(x + 6, y - 45 + b); G.fill();
      G.fillStyle = '#5b4a9a'; G.font = '900 13px Nunito'; G.textAlign = 'center'; G.fillText('...?', x, y - 52 + b); break;
    }
    case 'desk': shadow(24); G.fillStyle = '#6b4226'; G.fillRect(x - 26, y - 32, 52, 22); G.fillStyle = '#8a5a34'; G.fillRect(x - 26, y - 34, 52, 5); G.fillStyle = '#f3ead2'; G.fillRect(x - 18, y - 44, 18, 12); G.fillStyle = '#e1d2a8'; G.fillRect(x + 2, y - 42, 16, 10); G.fillStyle = '#2a2a2a'; G.fillRect(x - 14, y - 40, 10, 1); G.fillRect(x - 14, y - 37, 8, 1); break;
    case 'panel': shadow(18); G.fillStyle = '#8c879e'; rr(G, x - 20, y - 64, 40, 62, 6); G.fill(); G.fillStyle = '#6e6a86'; G.fillRect(x - 14, y - 56, 28, 44); G.strokeStyle = `rgba(255,120,120,${0.5 + 0.4 * Math.sin(t * 4)})`; G.lineWidth = 2; G.beginPath(); G.moveTo(x - 8, y - 50); G.lineTo(x + 3, y - 34); G.lineTo(x - 4, y - 20); G.stroke(); break;
    case 'crystal': for (const [dx, hh] of [[-12, 46], [0, 64], [12, 40]]) { G.fillStyle = `rgba(200,150,255,${0.7 + 0.3 * Math.sin(t * 2 + dx)})`; G.beginPath(); G.moveTo(x + dx, y - hh); G.lineTo(x + dx + 9, y - 4); G.lineTo(x + dx - 9, y - 4); G.fill(); G.fillStyle = 'rgba(255,255,255,.6)'; G.fillRect(x + dx - 2, y - hh + 12, 2, hh / 3); } break;
    case 'mirror': shadow(16); G.fillStyle = '#c9a43a'; rr(G, x - 18, y - 70, 36, 66, 16); G.fill(); G.fillStyle = `rgba(190,220,255,${0.75 + 0.2 * Math.sin(t * 2)})`; rr(G, x - 13, y - 65, 26, 56, 12); G.fill(); G.fillStyle = 'rgba(255,255,255,.7)'; G.fillRect(x - 7, y - 58, 3, 22); break;
    case 'chips': for (let k = 0; k < 5; k++) { const yy = y - 10 - (k % 2) * 12 + Math.sin(t * 3 + k) * 3; G.fillStyle = '#f3ead2'; rr(G, x - 34 + k * 14, yy - 8, 16, 12, 2); G.fill(); G.fillStyle = '#7b4fd6'; G.fillRect(x - 31 + k * 14, yy - 4, 10, 2); } break;
  }
}

function markerFor(p) { return UI.markerFor(p); }
function drawMarker(G, p, t, top) {
  const m = markerFor(p); if (!m) return;
  const y = top - 14 + Math.sin(t * 4) * 3;
  G.fillStyle = m === '!' ? '#f2c14e' : '#8fd3ff'; G.strokeStyle = '#2a1b00'; G.lineWidth = 2.5;
  G.beginPath(); G.arc(p.x, y, 12, 0, 7); G.fill(); G.stroke();
  G.beginPath(); G.moveTo(p.x - 5, y + 10); G.lineTo(p.x, y + 17); G.lineTo(p.x + 5, y + 10); G.fill();
  G.fillStyle = '#2a1b00'; G.font = '900 17px Nunito'; G.textAlign = 'center'; G.textBaseline = 'middle'; G.fillText(m, p.x, y + 1); G.textBaseline = 'alphabetic';
  if (p.look === 'none') for (let k = 0; k < 3; k++) { const a = t * 2 + k * 2.1; G.fillStyle = `rgba(255,240,160,${0.5 + 0.4 * Math.sin(t * 5 + k)})`; G.fillRect(p.x + Math.cos(a) * 26 - 2, p.y - 20 + Math.sin(a) * 12 - 2, 4, 4); }
}
const POINT_TOP = { npc: 96, sign: 70, lectern: 60, bank: 104, portal: 30, rune: 40, bus: 80, chat: 76, desk: 50, panel: 72, crystal: 70, mirror: 76, chips: 34, none: 30 };

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0b0b1e'; ctx.fillRect(0, 0, cv.width, cv.height);
  const p = world.player, a = world.area; if (!p || !a) return;
  const m = world.map;
  world.cam.x = clamp(p.x - view.w / 2, 0, Math.max(0, a.w - view.w));
  world.cam.y = clamp(p.y - 30 - view.h / 2, 0, Math.max(0, a.h - view.h));
  const s = view.scale * view.dpr;
  ctx.setTransform(s, 0, 0, s, -world.cam.x * s, -world.cam.y * s);
  ctx.imageSmoothingEnabled = !m.pixel;
  if (ready(m.bg) || m.bg instanceof HTMLCanvasElement) ctx.drawImage(m.bg, 0, 0, a.w, a.h);
  const t = world.t;
  // label bangunan
  ctx.font = '900 13px Nunito'; ctx.textAlign = 'center';
  for (const [lx, ly, txt] of a.labels || []) {
    const w = ctx.measureText(txt).width + 18;
    ctx.fillStyle = 'rgba(42,27,16,.9)'; rr(ctx, lx - w / 2, ly - 13, w, 20, 5); ctx.fill();
    ctx.strokeStyle = '#c9951f'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#f2c14e'; ctx.fillText(txt, lx, ly + 2);
  }
  const ds = [];
  for (const q of world.points) {
    if (q.type === 'npc') {
      if (SPRITES[q.id]) ds.push({ y: q.y, f: () => drawHero(ctx, q.id, q.x, q.y, 'down', false, 0, { phase: q.x }) });
      else ds.push({ y: q.y, f: () => drawChar(ctx, q.x, q.y, STYLES[q.id]) });
    } else if (q.look !== 'none') ds.push({ y: q.look === 'rune' || q.look === 'portal' ? q.y - 40 : q.y, f: () => drawObject(ctx, q, t) });
  }
  const ai = world.aisyah, hatItem = S.equip.hat && SHOP_BY_ID[S.equip.hat];
  ds.push({ y: ai.y, f: () => drawHero(ctx, 'aisyah', ai.x, ai.y, ai.dir, ai.moving, ai.anim, { phase: 0.4 }) });
  ds.push({ y: p.y + 0.1, f: () => drawHero(ctx, 'amir', p.x, p.y, p.moving || p.idleT < 0.25 ? p.dir : 'down', p.moving, p.anim, { hat: hatItem ? hatItem.hat : null }) });
  ds.sort((u, v) => u.y - v.y).forEach(d => d.f());
  for (const q of world.points) drawMarker(ctx, q, t, q.y - (q.type === 'npc' ? (q.id === 'nazhif' ? 108 : POINT_TOP.npc) : POINT_TOP[q.look] || 40));
  // zarah suasana
  for (const f of world.fx) {
    const al = Math.min(1, f.t / 2);
    if (f.k === 'word') { ctx.fillStyle = `rgba(200,160,255,${0.6 * al})`; ctx.font = '900 14px Nunito'; ctx.fillText(f.txt, f.x, f.y); }
    else if (f.k === 'mote') { ctx.fillStyle = world.areaId === 'forest' ? `rgba(160,255,200,${0.8 * al})` : `rgba(220,160,255,${0.8 * al})`; ctx.beginPath(); ctx.arc(f.x, f.y, 2.5, 0, 7); ctx.fill(); }
    else if (f.k === 'spark') { ctx.fillStyle = `rgba(255,230,150,${al})`; ctx.fillRect(f.x - 2, f.y - 2, 4, 4); }
  }
  // gesaan interaksi
  if (world.near && UI.mode === 'play') {
    const q = world.near; ctx.font = '900 13px Nunito'; ctx.textAlign = 'center';
    const label = `${isTouch ? 'AKSI' : 'E'} · ${q.name}`, tw = ctx.measureText(label).width + 18;
    ctx.fillStyle = 'rgba(20,21,52,.92)'; rr(ctx, q.x - tw / 2, q.y + 10, tw, 22, 6); ctx.fill(); ctx.strokeStyle = '#c9951f'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#f2c14e'; ctx.fillText(label, q.x, q.y + 26);
  }
  // vinyet
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const gr = ctx.createRadialGradient(cv.width / 2, cv.height / 2, cv.height * 0.35, cv.width / 2, cv.height / 2, cv.width * 0.75);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, world.areaId === 'arena' ? 'rgba(30,0,50,.45)' : 'rgba(0,0,20,.28)');
  ctx.fillStyle = gr; ctx.fillRect(0, 0, cv.width, cv.height);
}

// Latar kabur & malap (cache) untuk mini-game dan bos
function blurredBg(src, W, H, dim) {
  const okSrc = src instanceof HTMLCanvasElement || ready(src); if (!okSrc) return { w: W, h: H, c: null };
  const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height, c = document.createElement('canvas');
  c.width = Math.ceil(W / 2); c.height = Math.ceil(H / 2); const g = c.getContext('2d');
  const s = Math.max(c.width / sw, c.height / sh); g.filter = 'blur(2px) saturate(1.1)';
  g.drawImage(src, (c.width - sw * s) / 2, (c.height - sh * s) / 2, sw * s, sh * s); g.filter = 'none';
  g.fillStyle = `rgba(12,10,36,${dim})`; g.fillRect(0, 0, c.width, c.height);
  return { w: W, h: H, c };
}
