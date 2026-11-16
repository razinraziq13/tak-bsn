// TAK BSN — pertarungan bos aksi masa nyata.
// Elak serangan bos, sentuh orb jawapan yang betul untuk melancarkan sihir buku ke arah bos.
// Peraturan GDD: 3 nyawa; jawapan salah = -1 nyawa & soalan sama; 0 nyawa = ulang set sama dari soalan 1;
// 1 petunjuk Aisyah percuma / cubaan; maks. 1 power-up berbayar / soalan. Tambahan aksi: kena serangan 3 kali (Fokus) = -1 nyawa.
'use strict';

async function bossGate(n) {
  const b = BOSSES[n];
  if (!stageUnlocked(n)) return say({ name: 'Bulatan Rune' }, 'Bulatan ini masih dikunci.');
  const won = S.bosses[n] && S.bosses[n].won;
  if (!stageDone(n)) {
    const left = stageQuests(n).filter(q => questStatus(q.id) !== 'selesai').map(q => q.name);
    return say('aisyah', `Bulatan rune ini masih malap. Selesaikan dahulu misi Tahap ${n}: <b>${left.join(', ')}</b>.`);
  }
  const c = await ask('aisyah', won
    ? `Halaman “${b.page}” sudah dipulihkan. Mahu bertarung semula dengan <b>${b.name}</b> untuk latihan? (Tiada ganjaran token kali kedua.)`
    : `Ini dia — <b>${b.name}</b>! ${QBY_OWNER['S' + n + '-B'].length} soalan, 3 nyawa. <b>Elak serangannya</b> dan sentuh <b>orb jawapan yang betul</b> untuk melancarkan sihir buku. Saya ada 1 petunjuk istimewa untuk kamu!`,
    ['Mula Pertarungan', 'Belum Lagi']);
  if (c === 0) startBoss(n);
}

const BOSS = {};
async function startBoss(n) {
  const b = BOSSES[n];
  S.bosses[n] = S.bosses[n] || { won: false, runs: 0 };
  S.bosses[n].runs++; save();
  setMode('boss'); playMusic(b.music);
  const sc = $('#screen'); sc.className = 'bars'; sc.style.backgroundImage = `url(assets/bg/stage${n}.jpg)`;
  sc.innerHTML = `<div><img src="assets/boss/boss${n}.png" class="boss-intro-img"><div class="cine-text" style="margin-top:14px">${b.name}</div><p style="font-size:16px;max-width:620px;margin:8px auto">${b.intro}</p><p class="muted" style="font-size:14px">${isTouch ? 'Joystick: bergerak' : 'WASD / anak panah: bergerak'} · Sentuh orb jawapan betul · Elak serangan</p></div>`;
  sc.classList.remove('hidden'); sfx('magic'); flash('#b98cff', 300);
  await new Promise(r => setTimeout(r, S.settings.reduce ? 600 : 2800));
  sc.className = 'hidden';
  bossArena(n);
}

function bossArena(n) {
  const b = BOSSES[n], el = $('#boss');
  el.classList.remove('hidden');
  el.innerHTML = `<canvas id="bossc"></canvas>
    <div class="bh-top"><div class="bh-name">${b.name}</div><div class="bh-hp"><i id="bhp"></i><span id="bhpt"></span></div><div class="bh-lives" id="blives"></div><button class="ghost" id="bx">Undur</button></div>
    <div class="mg-q bh-q"><div class="mg-ins" id="bins"></div><div class="mg-sent" id="bsent"></div><div class="mg-fb" id="bfb"></div>${b.timed ? '<div class="timer" style="margin-top:6px"><i id="btime"></i></div>' : ''}</div>
    <div class="bh-pw" id="bpw"></div><div class="bh-aisyah hidden" id="baisyah"><img src="${PORTRAITS.aisyah}" alt=""><div id="baisyaht"></div></div>`;
  const c = el.querySelector('#bossc'), G = c.getContext('2d');
  const bgSrc = buildMap(STAGE_AREA[n]).bg, bimg = img(`assets/boss/boss${n}.png`); let bgCache = null;
  const B = Object.assign(BOSS, {
    n, qs: QBY_OWNER['S' + n + '-B'], idx: 0, built: [], lives: CONFIG.bossLives, focus: CONFIG.focusMax, freeHint: false, paidUsed: false, shield: false,
    t: 0, W: 0, H: 0, top: 0, px: 0, py: 0, pdir: 'up', pmove: false, panim: 0, inv: 0, orbs: [], shots: [], bullets: [], fx: [], fogs: [],
    calm: 1.5, over: false, timeLeft: CONFIG.stage2Timer, hit: 0, hpShow: 0, glowNext: 0, atkT: 1.5, atk2: 0, spiralA: 0, phase: 0, shake: 0, tries: 0,
  });
  let bossMask = null;
  function maskBoss() {
    if (bossMask || !ready(bimg)) return bossMask;
    const w = bimg.naturalWidth, h = bimg.naturalHeight, m = document.createElement('canvas'); m.width = w; m.height = h;
    const g = m.getContext('2d'); g.drawImage(bimg, 0, 0);
    g.globalCompositeOperation = 'destination-in';
    g.save(); g.translate(w / 2, h / 2); g.scale(1, h / w);
    const gr = g.createRadialGradient(0, 0, w * 0.36, 0, 0, w * 0.5);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, w * 0.5, 0, 7); g.fill(); g.restore();
    return (bossMask = m);
  }
  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    B.W = innerWidth; B.H = innerHeight; c.width = B.W * dpr; c.height = B.H * dpr; G.setTransform(dpr, 0, 0, dpr, 0, 0);
    B.top = el.querySelector('.bh-q').getBoundingClientRect().bottom + 6;
    B.bw = Math.min(B.W * 0.36, 300, (B.H - B.top) * 0.62); B.bh = B.bw * 0.64; B.bx = B.W / 2; B.by = B.top + B.bh / 2 + 6;
    B.floorTop = B.by + B.bh / 2 + 10;
    B.k = clamp(B.H / 720, 0.6, 1); B.mx0 = isTouch ? 170 : 50; B.mx1 = B.W - 140;
  }
  const q = () => B.qs[B.idx];
  const expected = () => q().kind === 'reorder' ? seqWords(q())[B.built.length] : q().ans;
  function setQ() {
    const Q = q(); B.built = []; B.tries = 0; B.paidUsed = false; B.timeLeft = CONFIG.stage2Timer; B.calm = 1.0; B.orbs = [];
    el.querySelector('#bins').textContent = `Soalan ${B.idx + 1}/${B.qs.length} · ${Q.ins}`;
    el.querySelector('#bsent').innerHTML = sentenceHtml(Q, B.built, false);
    const fb = el.querySelector('#bfb'); fb.className = 'mg-fb'; fb.innerHTML = '';
    resize(); hud(); setTimeout(spawnOrbs, 500);
  }
  function spawnOrbs() {
    if (B.over) return;
    const Q = q(); const labels = Q.kind === 'reorder' ? seqWords(Q).slice(B.built.length) : [...Q.opts, ...Q.opts];
    B.orbs = [];
    for (const label of shuffle(labels)) {
      let x, y, k = 0;
      do { x = B.mx0 + Math.random() * (B.mx1 - B.mx0); y = B.floorTop + 30 * B.k + Math.random() * Math.max(30, B.H - B.floorTop - 70 * B.k); k++; } while (k < 40 && (Math.hypot(x - B.px, y - B.py) < 140 * B.k || B.orbs.some(o => Math.hypot(o.x - x, o.y - y) < 90 * B.k)));
      const a = Math.random() * 6.28, sp = 25 + n * 7;
      B.orbs.push({ label, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: Math.max(24, 34 * B.k), born: B.t, glow: 0 });
    }
  }
  function hud() {
    const N = B.qs.length;
    el.querySelector('#bhp').style.width = ((N - B.idx) / N * 100) + '%';
    el.querySelector('#bhpt').textContent = `${N - B.idx}/${N}`;
    el.querySelector('#blives').innerHTML = [0, 1, 2].map(k => `<span class="${k < B.lives ? '' : 'off'}">❤️</span>`).join('') + (B.shield ? ' 🛡️' : '') +
      `<span class="bh-focus" title="Fokus: kena serangan ${CONFIG.focusMax} kali = -1 nyawa">${Array.from({ length: CONFIG.focusMax }, (_, k) => `<i class="${k < B.focus ? 'on' : ''}"></i>`).join('')}</span>`;
    const inv = S.inv, paid = B.paidUsed;
    el.querySelector('#bpw').innerHTML = `
      <button id="pwA" ${B.freeHint ? 'disabled' : ''}>🧕 Aisyah <kbd>H</kbd></button>
      <button id="pwH" ${!inv.hint || paid ? 'disabled' : ''}>💡 ×${inv.hint || 0} <kbd>1</kbd></button>
      <button id="pwS" ${!inv.shield || paid || B.shield ? 'disabled' : ''}>🛡️ ×${inv.shield || 0} <kbd>2</kbd></button>
      <button id="pwL" ${!inv.heal || paid || B.lives >= 3 ? 'disabled' : ''}>❤️ ×${inv.heal || 0} <kbd>3</kbd></button>`;
    el.querySelector('#pwA').onclick = aisyahHint; el.querySelector('#pwH').onclick = () => paid1('hint');
    el.querySelector('#pwS').onclick = () => paid1('shield'); el.querySelector('#pwL').onclick = () => paid1('heal');
  }
  function say2(html, ms = 4500) { const a = el.querySelector('#baisyah'); el.querySelector('#baisyaht').innerHTML = html; a.classList.remove('hidden'); clearTimeout(say2.t); say2.t = setTimeout(() => a.classList.add('hidden'), ms); }
  function aisyahHint() {
    if (B.freeHint || B.over) return; B.freeHint = true; const Q = q(); sfx('magic');
    if (Q.kind === 'reorder') { B.glowNext = 6; say2('Saya tandakan perkataan seterusnya dengan cahaya emas. Ikut susunannya!'); }
    else {
      const kp = keyPhrase(Q);
      say2(Q.rule === 'pertentangan_maklumat' ? 'Perhatikan “tetapi” dalam ayat — ada maksud pertentangan!' : Q.rule === 'frasa_kerja_atau_adjektif' ? `Lihat “${esc(kp)}”. Itu perbuatan atau sifat.` : `Lihat “${esc(kp)}”. Itu nama orang/benda/tempat atau frasa sendi nama.`);
    }
    hud();
  }
  function paid1(kind) {
    if (B.paidUsed || !S.inv[kind] || B.over) return;
    if (kind === 'heal' && B.lives >= 3) return; if (kind === 'shield' && B.shield) return;
    S.inv[kind]--; B.paidUsed = true; save(); sfx('magic');
    const Q = q();
    if (kind === 'hint') {
      if (Q.kind === 'reorder') say2(`Struktur: <b>subjek → kata nafi → kata kerja/adjektif/nama → keterangan</b>.`, 6000);
      else { const ex = shuffle(QBANK.filter(x => x.rule === Q.rule && x.id !== Q.id))[0]; say2(`Contoh peraturan sama: <i>${esc(ex.canon)}</i><br>${RULE_LABEL[Q.rule]}`, 6500); }
    } else if (kind === 'shield') { B.shield = true; toast('🛡️ Perisai aktif'); }
    else { B.lives = Math.min(3, B.lives + 1); toast('❤️ +1 nyawa'); }
    hud();
  }
  // ---------- kesan ----------
  function burst(x, y, col, cnt, sp = 220) { for (let k = 0; k < cnt; k++) { const a = Math.random() * 6.28, s = 40 + Math.random() * sp; B.fx.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 0.5 + Math.random() * 0.6, col, r: 2 + Math.random() * 4 }); } }
  function ftext(x, y, txt, col) { B.fx.push({ x, y, vx: 0, vy: -60, t: 1.2, txt, col }); }
  function loseLife(why) {
    if (B.shield) { B.shield = false; toast('🛡️ Perisai melindungi nyawa kamu!'); hud(); return; }
    B.lives--; sfx('hurt'); flash('#e0565b', 220); B.shake = 0.4; ftext(B.px, B.py - 120, '-1 ❤️ ' + why, '#ff9a9e'); hud();
    if (B.lives <= 0) defeat();
  }
  // ---------- jawapan ----------
  function touchOrb(o) {
    const Q = q(), ok = norm(o.label) === norm(expected());
    if (ok) {
      if (Q.kind === 'reorder') {
        B.built.push(o.label); sfx('shoot'); burst(o.x, o.y, '#8ff0a8', 14);
        B.shots.push({ x: B.px, y: B.py - 60, small: true, t: 0 });
        el.querySelector('#bsent').innerHTML = sentenceHtml(Q, B.built, false);
        B.orbs = B.orbs.filter(x => x !== o);
        if (B.built.length < seqWords(Q).length) return;
      }
      recordSub(true); B.orbs = []; B.calm = 99;
      el.querySelector('#bsent').innerHTML = sentenceHtml(Q, B.built, true);
      const fb = el.querySelector('#bfb'); fb.className = 'mg-fb ok'; fb.innerHTML = `✔ <b>Tepat!</b> ${esc(Q.exp)}`;
      sfx('shoot'); B.shots.push({ x: B.px, y: B.py - 60, big: true, t: 0 });
    } else {
      recordSub(false); B.tries++; burst(o.x, o.y, '#ff6b70', 18); o.x = B.mx0 + Math.random() * (B.mx1 - B.mx0); o.y = B.floorTop + o.r + Math.random() * Math.max(30, B.H - B.floorTop - 2 * o.r);
      B.inv = 1.0;
      const fb = el.querySelector('#bfb'); fb.className = 'mg-fb bad'; fb.innerHTML = `✖ <b>${esc(o.label)}</b> belum tepat. <b>Nasihat:</b> ${Q.kind === 'reorder' ? hintText(Q, 1) : RULE_HINT[Q.rule]}`;
      loseLife('jawapan salah');
    }
  }
  function bossHit() {
    B.hit = 0.5; B.shake = 0.35; sfx('boom'); burst(B.bx, B.by, b.color, 40, 320); ftext(B.bx, B.by - B.bh / 2, '💥 -1', '#fff');
    B.idx++; hud();
    if (B.idx >= B.qs.length) return victory();
    B.bullets = []; setTimeout(() => { if (!B.over) setQ(); }, 900);
  }
  // ---------- serangan bos ----------
  function fire(x, y, vx, vy, kind, r = 12) { B.bullets.push({ x, y, vx, vy, kind, r, t: 0 }); }
  function attack(dt) {
    const mode = n === 5 ? [1, 2, 3, 4][Math.floor(B.t / 7) % 4] : n;
    const sp = 1 + (n - 1) * 0.08;
    B.atkT -= dt;
    if (mode === 1) { if (B.atkT <= 0) { B.atkT = 0.55 / sp; fire(40 + Math.random() * (B.W - 80), B.floorTop - 10, (Math.random() - .5) * 30, 120 * sp + Math.random() * 50, 'q', 13); }
      if (n === 1 && Math.random() < dt / 7) B.fogs.push({ x: -200, y: B.floorTop + Math.random() * (B.H - B.floorTop), vx: 60, t: 8 }); }
    if (mode === 2 && B.atkT <= 0) { B.atkT = 2.0 / sp; const a0 = Math.atan2(B.py - 40 - B.by, B.px - B.bx); for (let k = -2; k <= 2; k++) { const a = a0 + k * 0.22; fire(B.bx, B.by + B.bh * 0.3, Math.cos(a) * 170 * sp, Math.sin(a) * 170 * sp, 'x', 13); } sfx('whoosh'); }
    if (mode === 3) { B.atk2 -= dt; if (B.atk2 <= 0) { B.atk2 = 0.16 / sp; B.spiralA += 0.5; for (const off of [0, Math.PI]) { const a = B.spiralA + off; fire(B.bx, B.by + 10, Math.cos(a) * 120 * sp, Math.abs(Math.sin(a)) * 120 * sp + 25, 's', 11); } }
      if (B.atkT <= 0) { B.atkT = 7; if (B.orbs.length && B.calm <= 0) { B.orbs.forEach(o => { burst(o.x, o.y, '#c58cff', 8); o.x = B.mx0 + Math.random() * (B.mx1 - B.mx0); o.y = B.floorTop + o.r + Math.random() * Math.max(30, B.H - B.floorTop - 2 * o.r); }); ftext(B.W / 2, B.floorTop + 30, 'Tukar Susun!', '#e0b8ff'); sfx('whoosh'); } } }
    if (mode === 4) { if (B.atkT <= 0) { B.atkT = 3.2 / sp; const gap = 170, gx = 80 + Math.random() * (B.W - 160 - gap); B.bullets.push({ wall: true, y: B.floorTop, vy: 110 * sp, gx, gap, t: 0 }); sfx('whoosh'); }
      B.atk2 -= dt; if (B.atk2 <= 0) { B.atk2 = 2.2 / sp; const a = Math.atan2(B.py - 40 - B.by, B.px - B.bx); fire(B.bx, B.by + B.bh * 0.3, Math.cos(a) * 210 * sp, Math.sin(a) * 210 * sp, 'sw', 14); } }
  }
  // ---------- gelung ----------
  function update(dt) {
    B.t += dt; if (B.calm > 0 && B.calm < 50) B.calm -= dt; if (B.inv > 0) B.inv -= dt; if (B.hit > 0) B.hit -= dt; if (B.shake > 0) B.shake -= dt; if (B.glowNext > 0) B.glowNext -= dt;
    const v = moveVec();
    B.px = clamp(B.px + v.x * 250 * dt, 30, B.W - 30); B.py = clamp(B.py + v.y * 250 * dt, B.floorTop + 60 * B.k, B.H - 8);
    B.pmove = v.len > 0.1; if (B.pmove) { B.pdir = Math.abs(v.x) > Math.abs(v.y) ? (v.x < 0 ? 'left' : 'right') : (v.y < 0 ? 'up' : 'down'); B.panim += dt * 10; }
    if (b.timed && B.calm <= 0 && !B.over) {
      B.timeLeft -= dt; const tb = el.querySelector('#btime'); if (tb) tb.style.width = clamp(B.timeLeft / CONFIG.stage2Timer * 100, 0, 100) + '%';
      if (B.timeLeft <= 0) { B.timeLeft = CONFIG.stage2Timer; recordSub(false); const fb = el.querySelector('#bfb'); fb.className = 'mg-fb bad'; fb.innerHTML = '⏰ <b>Masa tamat!</b> Cuba soalan yang sama. ' + RULE_HINT[q().rule]; loseLife('masa tamat'); }
    }
    for (const o of B.orbs) {
      o.x += o.vx * dt; o.y += o.vy * dt;
      if (o.x < B.mx0 || o.x > B.mx1) o.vx *= -1; if (o.y < B.floorTop + o.r || o.y > B.H - o.r) o.vy *= -1;
      o.x = clamp(o.x, B.mx0, B.mx1); o.y = clamp(o.y, B.floorTop + o.r, B.H - o.r);
    }
    for (const o of B.orbs) { const dx = o.x - B.px, dy = o.y - (B.py - 40 * B.k), d = Math.hypot(dx, dy) || 1;
      if (!B.pmove && d < o.r + 34) { o.x = B.px + dx / d * (o.r + 34); o.y = B.py - 40 * B.k + dy / d * (o.r + 34); const dot = (o.vx * dx + o.vy * dy) / d; if (dot < 0) { o.vx -= 2 * dot * dx / d; o.vy -= 2 * dot * dy / d; } } }
    if (B.calm <= 0 && !B.over && B.inv <= 0.5 && B.pmove) { let best = null, bd = 1e9; for (const o of B.orbs) { const d = Math.hypot(o.x - B.px, o.y - (B.py - 40 * B.k)); if (B.t - o.born > 0.4 && d < o.r + 22 && d < bd) { bd = d; best = o; } } if (best) touchOrb(best); }
    if (!B.over && B.calm < 50) attack(dt);
    for (const bl of B.bullets) {
      bl.t += dt;
      if (bl.wall) { bl.y += bl.vy * dt; if (B.inv <= 0 && Math.abs(bl.y - (B.py - 30)) < 14 && !(B.px > bl.gx && B.px < bl.gx + bl.gap)) hurt(); continue; }
      bl.x += bl.vx * dt; bl.y += bl.vy * dt;
      if (B.inv <= 0 && Math.hypot(bl.x - B.px, bl.y - (B.py - 35 * B.k)) < bl.r + 12) { bl.dead = true; hurt(); }
    }
    B.bullets = B.bullets.filter(bl => !bl.dead && bl.t < 12 && (bl.wall ? bl.y < B.H + 20 : bl.x > -40 && bl.x < B.W + 40 && bl.y > B.top - 40 && bl.y < B.H + 40));
    for (const s of B.shots) {
      s.t += dt; const tx = B.bx, ty = B.by, d = Math.hypot(tx - s.x, ty - s.y), spd = s.big ? 700 : 900;
      if (d < 30) { s.dead = true; if (s.big) bossHit(); else { burst(tx, ty, '#bfffd0', 8); B.hit = 0.15; } continue; }
      s.x += (tx - s.x) / d * spd * dt; s.y += (ty - s.y) / d * spd * dt;
      B.fx.push({ x: s.x, y: s.y, vx: 0, vy: 0, t: 0.25, col: s.big ? '#ffe28a' : '#9effb5', r: s.big ? 8 : 4 });
    }
    B.shots = B.shots.filter(s => !s.dead);
    for (const f of B.fx) { f.x += f.vx * dt; f.y += f.vy * dt; if (!f.txt) f.vy += 200 * dt; f.t -= dt; }
    B.fx = B.fx.filter(f => f.t > 0);
    for (const f of B.fogs) { f.x += f.vx * dt; f.t -= dt; } B.fogs = B.fogs.filter(f => f.t > 0);
  }
  function hurt() {
    if (B.over) return;
    B.inv = 1.2; B.focus--; sfx('hurt'); B.shake = 0.25; burst(B.px, B.py - 40, '#ff9a9e', 12); ftext(B.px, B.py - 100, 'Fokus -1', '#ffb3b3');
    if (B.focus <= 0) { B.focus = CONFIG.focusMax; loseLife('fokus habis'); }
    hud();
  }
  function draw() {
    const { W, H } = B;
    G.save(); if (B.shake > 0) G.translate((Math.random() - .5) * 12, (Math.random() - .5) * 10);
    if (!bgCache || bgCache.w !== W || bgCache.h !== H || !bgCache.c) bgCache = blurredBg(bgSrc, W, H, 0.5);
    if (bgCache.c) G.drawImage(bgCache.c, -12 + Math.sin(B.t * 0.3) * 10, -8, W + 24, H + 16); else { G.fillStyle = '#120c2c'; G.fillRect(0, 0, W, H); }
    G.fillStyle = 'rgba(10,6,30,.25)'; G.fillRect(0, 0, W, H);
    const fl = G.createLinearGradient(0, B.floorTop, 0, H); fl.addColorStop(0, 'rgba(120,80,220,.12)'); fl.addColorStop(1, 'rgba(120,80,220,.32)'); G.fillStyle = fl; G.fillRect(0, B.floorTop, W, H - B.floorTop);
    G.strokeStyle = 'rgba(200,160,255,.25)'; G.lineWidth = 2; G.beginPath(); G.ellipse(W / 2, (B.floorTop + H) / 2 + 10, W * 0.42, (H - B.floorTop) * 0.42, 0, 0, 7); G.stroke();
    // bos
    const m = maskBoss(), bob = Math.sin(B.t * 2) * 6;
    if (!B.dead) {
      const aura = G.createRadialGradient(B.bx, B.by, 10, B.bx, B.by, B.bw * 0.75);
      aura.addColorStop(0, b.color + 'aa'); aura.addColorStop(1, b.color + '00'); G.fillStyle = aura; G.beginPath(); G.arc(B.bx, B.by + bob, B.bw * 0.75, 0, 7); G.fill();
      G.fillStyle = 'rgba(8,4,24,.85)'; G.beginPath(); G.ellipse(B.bx, B.by + bob, B.bw * 0.5, B.bh * 0.5, 0, 0, 7); G.fill();
      if (m) { G.save(); if (B.hit > 0) { G.filter = 'brightness(2.2)'; G.translate((Math.random() - .5) * 14, 0); } G.drawImage(m, B.bx - B.bw / 2, B.by - B.bh / 2 + bob, B.bw, B.bh); G.restore(); }
      G.save(); G.shadowColor = b.color; G.shadowBlur = 24; G.strokeStyle = b.color; G.lineWidth = 4; G.beginPath(); G.ellipse(B.bx, B.by + bob, B.bw * 0.5, B.bh * 0.5, 0, 0, 7); G.stroke();
      G.lineWidth = 2; G.strokeStyle = 'rgba(255,255,255,.6)'; G.setLineDash([10, 14]); G.lineDashOffset = -B.t * 40; G.beginPath(); G.ellipse(B.bx, B.by + bob, B.bw * 0.54, B.bh * 0.54, 0, 0, 7); G.stroke(); G.setLineDash([]); G.restore();
      for (let k = 0; k < 14; k++) { const a = k / 14 * 6.28 + B.t * 0.8; G.fillStyle = b.color; G.globalAlpha = 0.5 + 0.5 * Math.sin(B.t * 3 + k); G.fillRect(B.bx + Math.cos(a) * B.bw * 0.56 - 3, B.by + bob + Math.sin(a) * B.bh * 0.56 - 3, 6, 6); } G.globalAlpha = 1;
    } else if (B.pageT != null) {
      const k = Math.min(1, B.pageT); G.fillStyle = `rgba(255,240,180,${k})`; G.save(); G.translate(B.bx, B.by); G.rotate(Math.sin(B.t * 2) * 0.1); G.fillStyle = '#fff4cf'; rr(G, -70 * k, -90 * k, 140 * k, 180 * k, 8); G.fill(); G.strokeStyle = '#f2c14e'; G.lineWidth = 4; G.stroke();
      G.fillStyle = '#7a5300'; G.font = '900 16px Nunito'; G.textAlign = 'center'; if (k > 0.8) { G.fillText('📜', 0, -30); G.fillText(b.page.replace('Halaman ', ''), 0, 10, 130); } G.restore();
    }
    for (const f of B.fogs) for (let k = 0; k < 6; k++) { const fx = f.x + k * 55, fy = f.y + Math.sin(k * 1.7 + B.t) * 24, gr = G.createRadialGradient(fx, fy, 5, fx, fy, 90); gr.addColorStop(0, 'rgba(170,130,230,.45)'); gr.addColorStop(1, 'rgba(170,130,230,0)'); G.fillStyle = gr; G.fillRect(fx - 90, fy - 90, 180, 180); }
    // orb
    for (const o of B.orbs) {
      const nextGlow = B.glowNext > 0 && norm(o.label) === norm(expected());
      const pulse = 1 + Math.sin(B.t * 4 + o.x) * 0.05, r = o.r * pulse * Math.min(1, (B.t - o.born) * 3);
      const g2 = G.createRadialGradient(o.x - r * .3, o.y - r * .3, 3, o.x, o.y, r);
      g2.addColorStop(0, '#ffffff'); g2.addColorStop(0.5, nextGlow ? '#ffe28a' : '#b8a2ff'); g2.addColorStop(1, nextGlow ? '#c9951f' : '#5a3fb0');
      G.fillStyle = g2; G.beginPath(); G.arc(o.x, o.y, r, 0, 7); G.fill();
      G.strokeStyle = nextGlow ? '#fff3b0' : 'rgba(255,255,255,.7)'; G.lineWidth = nextGlow ? 4 : 2; G.stroke();
      G.fillStyle = '#1a1035'; G.font = '900 16px Nunito'; const fz = Math.max(9, Math.min(16, 16 * (2 * r - 10) / G.measureText(o.label).width)); G.font = `900 ${fz}px Nunito`; G.textAlign = 'center'; G.textBaseline = 'middle'; G.fillText(o.label, o.x, o.y + 1); G.textBaseline = 'alphabetic';
    }
    // pemain
    if (!(B.inv > 0 && Math.floor(B.t * 16) % 2 === 0)) drawHero(G, 'amir', B.px, B.py, B.pmove ? B.pdir : 'up', B.pmove, B.panim, { h: 100 * B.k });
    if (B.shield) { G.strokeStyle = `rgba(120,200,255,${0.6 + 0.3 * Math.sin(B.t * 6)})`; G.lineWidth = 3; G.beginPath(); G.arc(B.px, B.py - 45, 52, 0, 7); G.stroke(); }
    // peluru bos
    for (const bl of B.bullets) {
      if (bl.wall) { G.fillStyle = 'rgba(255,209,102,.8)'; G.fillRect(0, bl.y - 8, bl.gx, 16); G.fillRect(bl.gx + bl.gap, bl.y - 8, W - bl.gx - bl.gap, 16); G.fillStyle = '#fff'; G.fillRect(0, bl.y - 2, bl.gx, 4); G.fillRect(bl.gx + bl.gap, bl.y - 2, W, 4); continue; }
      G.save(); G.translate(bl.x, bl.y); G.rotate(bl.t * 4);
      if (bl.kind === 'q') { G.shadowColor = '#b98cff'; G.shadowBlur = 12; G.fillStyle = '#e0ccff'; G.font = '900 34px Nunito'; G.textAlign = 'center'; G.textBaseline = 'middle'; G.fillText('?', 0, 0); }
      else if (bl.kind === 'x') { G.fillStyle = '#fff4d6'; G.fillRect(-12, -14, 24, 28); G.strokeStyle = '#e0303a'; G.lineWidth = 4; G.beginPath(); G.moveTo(-7, -7); G.lineTo(7, 7); G.moveTo(7, -7); G.lineTo(-7, 7); G.stroke(); }
      else if (bl.kind === 's') { G.fillStyle = '#e3d0a6'; G.fillRect(-12, -6, 24, 12); G.fillStyle = '#9b6bd6'; G.fillRect(-12, -6, 4, 12); G.fillRect(8, -6, 4, 12); }
      else { G.fillStyle = '#ffd166'; G.beginPath(); G.moveTo(-16, 0); G.lineTo(0, -6); G.lineTo(16, 0); G.lineTo(0, 6); G.fill(); }
      G.restore();
    }
    for (const s of B.shots) { G.fillStyle = s.big ? '#fff3b0' : '#c9ffd8'; G.beginPath(); G.arc(s.x, s.y, s.big ? 14 : 7, 0, 7); G.fill(); if (s.big) { G.font = '22px sans-serif'; G.textAlign = 'center'; G.fillText('📖', s.x, s.y + 8); } }
    for (const f of B.fx) { G.globalAlpha = Math.min(1, f.t * 2); if (f.txt) { G.fillStyle = f.col; G.font = '900 24px Nunito'; G.textAlign = 'center'; G.fillText(f.txt, f.x, f.y); } else { G.fillStyle = f.col; G.fillRect(f.x - f.r / 2, f.y - f.r / 2, f.r, f.r); } G.globalAlpha = 1; }
    G.restore();
  }
  // ---------- tamat ----------
  function endPanel(html) { const box = document.createElement('div'); box.className = 'mg-end'; box.innerHTML = html; el.appendChild(box); return box; }
  function defeat() {
    B.over = true; sfx('lose'); B.bullets = [];
    const box = endPanel(`<div class="panel" style="width:min(520px,100%)"><div class="panel-head"><h2>💔 Nyawa habis!</h2></div><div class="panel-body">Jangan putus asa, Amir! Misi yang selesai kekal disimpan. Cubaan baharu bermula dengan 3 nyawa dari soalan 1 — set soalan yang sama.</div>
      <div class="panel-foot"><button id="bl0">Kembali</button><button class="primary" id="bl1">Cuba Lagi</button></div></div>`);
    box.querySelector('#bl0').onclick = end;
    box.querySelector('#bl1').onclick = () => { close(); startBoss(n); };
  }
  function victory() {
    B.over = true; B.dead = true; B.bullets = []; B.orbs = []; sfx('page'); playMusic('win');
    burst(B.bx, B.by, b.color, 90, 420); burst(B.bx, B.by, '#ffe28a', 60, 300);
    B.pageT = 0; const grow = setInterval(() => { B.pageT += 0.05; if (B.pageT >= 1) clearInterval(grow); }, 30);
    const first = !S.bosses[n].won;
    if (first) {
      S.bosses[n].won = true; S.bosses[n].wonAt = Date.now();
      credit(CONFIG.bossReward[n], 'boss_reward', 'boss' + n);
      if (n === 1) award('wira_kampung');
      if (pagesRestored() === 5) { award('penakluk'); award('wira_tatabahasa'); }
      save();
    }
    setTimeout(() => {
      const box = endPanel(`<div class="panel" style="width:min(560px,100%)"><div class="panel-head"><h2>📜 ${b.name} bertukar menjadi ${b.page}!</h2></div><div class="panel-body">
        ${first ? `Halaman ${n}/5 dipulihkan. <b>+${CONFIG.bossReward[n]} token</b>.${n < 5 ? ` <b>${AREAS[STAGE_AREA[n + 1]].name}</b> kini dibuka melalui Peta!` : ' Kelima-lima halaman bercahaya — Buku Misteri pulih sepenuhnya!'}` : 'Latihan semula berjaya! (Ganjaran utama hanya diberi sekali.)'}
        <br><span class="muted">Nyawa berbaki: ${'❤️'.repeat(B.lives)}</span></div><div class="panel-foot"><button class="primary" id="bwin">Teruskan ▸</button></div></div>`);
      box.querySelector('#bwin').onclick = async () => {
        end();
        if (first) {
          await say('aisyah', n === 1 ? 'Buku ini semakin jelas! Kita sudah membetulkan halaman pertama.' : n < 5 ? `Halaman ke-${n} pulih! Jom ke ${AREAS[STAGE_AREA[n + 1]].name} — buka Peta (M).` : 'Kita berjaya, Amir! Buku Misteri pulih sepenuhnya. Kamu dapat Lencana Wira Tatabahasa — lihat dalam Profil!');
          if (n === 5) await say('amir', `Sekarang aku perlu simpan ${CONFIG.upsiCost} token di Bank Impian untuk impian ke UPSI!`);
        }
      };
    }, 1900);
  }
  function close() { B.over = true; cancelAnimationFrame(raf); removeEventListener('resize', resize); el.classList.add('hidden'); el.innerHTML = ''; $('#touch').classList.add('hidden'); }
  function end() { close(); setMode('play'); AUD.theme = null; playMusic(world.area.music); hudUpdate(); }
  el.querySelector('#bx').onclick = async () => {
    const c2 = B.calm; B.calm = 999;
    if (await confirmBox('Undur dari pertarungan?', 'Misi yang selesai kekal disimpan. Kamu boleh mencabar bos ini semula dengan 3 nyawa.', 'Undur', 'Teruskan')) end(); else B.calm = c2;
  };
  BOSS.onKey = k => { if (k === 'h') aisyahHint(); if (k === '1') paid1('hint'); if (k === '2') paid1('shield'); if (k === '3') paid1('heal'); if (k === 'Escape') el.querySelector('#bx').click(); };
  addEventListener('resize', resize);
  $('#touch').classList.toggle('hidden', !isTouch); $('#actBtn').classList.add('hidden');
  resize(); B.px = B.W / 2; B.py = B.H - 30;
  setQ();
  let raf = 0, last = performance.now();
  const loop = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (UI.mode === 'boss' && !(B.calm > 500)) update(dt); draw(); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  BOSS.debugTick = dt => { update(dt); draw(); };
}
