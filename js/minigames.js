// TAK BSN — mini-game misi: 6 mod aksi (Tangkap, Gelembung, Larian, Sorong, Kutip, Ketuk).
// Setiap mod menyokong soalan pilihan (tidak/bukan) dan soalan susunan (susun perkataan).
'use strict';

const norm = s => String(s).toLowerCase().replace(/[.,!?;:“”"'’]/g, '').replace(/\s+/g, ' ').trim();
const checkAnswer = (q, ans) => norm(ans) === norm(q.ans);
function keyPhrase(q) { const m = q.canon.match(/\b(tidak|bukan)\s+([^\s,.]+(?:\s+[^\s,.]+)?)/i); return m ? m[2] : ''; }
function seqWords(q) { return q.ans.replace(/[.]$/, '').split(/\s+/); }
function hintText(q, tier) {
  if (q.kind === 'reorder') {
    const w = seqWords(q);
    if (tier <= 1) return 'Mulakan dengan subjek ayat (huruf besar). Kata nafi biasanya selepas subjek. ' + RULE_HINT[q.rule];
    if (tier === 2) return `Ayat bermula dengan: <b>${esc(w.slice(0, 2).join(' '))} …</b>`;
    return `Ayat rujukan: <b>${esc(q.canon)}</b>`;
  }
  if (tier <= 1) return RULE_HINT[q.rule];
  if (tier === 2) return `Fokus pada <b>“${esc(keyPhrase(q))}”</b>. ${esc(q.exp)}`;
  return `Ayat rujukan: <b>${esc(q.canon)}</b>`;
}
// Paparan ayat (HTML) mengikut jenis soalan & kemajuan susunan
function sentenceHtml(q, built, solved) {
  if (q.kind === 'reorder') {
    const w = seqWords(q);
    return w.map((x, i) => i < built.length ? `<span class="mg-w ok">${esc(built[i])}</span>` : '<span class="mg-w">＿＿</span>').join(' ') + (built.length === w.length ? '.' : '');
  }
  if (q.kind === 'correction') {
    if (solved) return esc(q.canon);
    return esc(q.prompt).replace(/\b(tidak|bukan)\b/i, m => `<span class="wrongword">${m}</span>`) + ' <span class="muted">→ ganti dengan?</span>';
  }
  return esc(q.prompt).replace('___', solved ? `<span class="mg-w ok">${esc(q.ans)}</span>` : '<span class="blank">?</span>');
}

const MG = { on: false };
function runMinigame(cfg) {
  return new Promise(resolve => {
    const stage = cfg.stage || 1;
    const el = $('#mg'); el.classList.remove('hidden');
    el.innerHTML = `<canvas id="mgc"></canvas>
      <div class="mg-top"><div class="mg-title"><b>${esc(cfg.title)}</b><span>${esc(MODE_NAMES[cfg.mode] || '')} · ${esc(cfg.sub || '')}</span></div>
        <div class="dots" id="mgdots"></div><div class="mg-score">⭐ <span id="mgscore">0</span></div><button class="ghost" id="mgx">✕</button></div>
      <div class="mg-q"><div class="mg-ins" id="mgins"></div><div class="mg-sent" id="mgsent"></div><div class="mg-fb" id="mgfb"></div></div>
      <div class="mg-help" id="mghelp"></div>`;
    setMode('minigame');
    const c = el.querySelector('#mgc'), G = c.getContext('2d');
    const bgSrc = buildMap(STAGE_AREA[stage] || 'hub').bg; let bgCache = null;
    const st = {
      qs: cfg.questions, i: 0, built: [], tries: 0, report: cfg.questions.map(q => ({ q, tries: 0, firstOk: null })),
      score: 0, combo: 0, items: [], fx: [], t: 0, calm: 1.2, done: false, W: 0, H: 0, top: 0,
      px: 0, py: 0, pdir: 'down', pmove: false, panim: 0, stun: 0, lane: 1, laneX: 0, card: null, blobs: [], spawnT: 0, scroll: 0, holes: [], target: null,
    };
    MG.on = true; MG.st = st;
    const mode = () => { const q = st.qs[st.i]; return cfg.mode === 'sorong' && q && q.kind === 'reorder' ? 'kutip' : cfg.mode; };
    const HELP = {
      tangkap: isTouch ? 'Seret atau guna joystick untuk gerakkan bakul.' : 'A/D atau ← → untuk gerak bakul. Tangkap kata yang betul!',
      gelembung: 'Klik/ketik gelembung yang betul sebelum ia terapung pergi.',
      larian: isTouch ? 'Ketik kiri/kanan skrin untuk tukar lorong.' : 'A/D atau ← → tukar lorong. Lalu pintu yang betul, elak batu!',
      sorong: isTouch ? 'Seret kad ke kiri atau kanan.' : 'A/D atau ← → sorong kad ke tong yang betul.',
      kutip: isTouch ? 'Joystick untuk berjalan. Elak tompok dakwat!' : 'WASD untuk berjalan dan kutip cip. Elak tompok dakwat!',
      ketuk: isTouch ? 'Ketik kata yang betul apabila ia muncul.' : 'Klik kata yang betul, atau tekan nombor lubang 1–6.',
    };
    function resize() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      st.W = innerWidth; st.H = innerHeight; c.width = st.W * dpr; c.height = st.H * dpr; G.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.top = el.querySelector('.mg-q').getBoundingClientRect().bottom + 8; st.k = clamp(st.H / 720, 0.58, 1);
    }
    function setupQ() {
      const q = st.qs[st.i]; st.built = []; st.tries = 0; st.items = []; st.calm = 0.9; st.spawnT = 0; st.card = null;
      el.querySelector('#mgins').textContent = q.ins;
      el.querySelector('#mgsent').innerHTML = sentenceHtml(q, st.built, false);
      el.querySelector('#mgfb').innerHTML = ''; el.querySelector('#mgfb').className = 'mg-fb';
      el.querySelector('#mgdots').innerHTML = st.qs.map((_, k) => `<i class="${k < st.i ? 'done' : k === st.i ? 'cur' : ''}"></i>`).join('');
      el.querySelector('#mghelp').textContent = HELP[mode()];
      $('#touch').classList.toggle('hidden', !(isTouch && ['tangkap', 'sorong', 'kutip'].includes(mode())));
      resize();
      const m = mode();
      st.px = st.W / 2; st.py = m === 'kutip' ? (st.top + st.H) / 2 + 40 * st.k : st.H - 70 * st.k;
      if (m === 'larian') { st.lane = 1; st.laneX = laneX(1); }
      if (m === 'kutip') { spawnChips(true); st.blobs = Array.from({ length: Math.min(4, 1 + stage) }, () => ({ x: Math.random() * st.W, y: st.top + 60 + Math.random() * (st.H - st.top - 120), vx: (Math.random() - .5) * 90, vy: (Math.random() - .5) * 90 })); }
      if (m === 'ketuk') setupHoles();
      if (m === 'sorong') newCard();
    }
    // ---------- pemilihan label ----------
    const q0 = () => st.qs[st.i];
    function expected() { const q = q0(); return q.kind === 'reorder' ? seqWords(q)[st.built.length] : q.ans; }
    function pool() { const q = q0(); if (q.kind === 'reorder') { const w = seqWords(q); return w.slice(st.built.length); } return q.opts; }
    function nextLabel(bias = 0.45) { const p = pool(); return Math.random() < bias ? expected() : p[Math.floor(Math.random() * p.length)]; }
    function pick(label, x, y) {
      if (st.calm > 0 || st.done) return false;
      const q = q0(), r = st.report[st.i];
      if (q.kind === 'reorder') {
        if (norm(label) === norm(expected())) {
          st.built.push(label); sfx('pop'); burst(x, y, '#8ff0a8', 10);
          el.querySelector('#mgsent').innerHTML = sentenceHtml(q, st.built, false);
          if (st.built.length === seqWords(q).length) return solved(x, y);
          st.items = st.items.filter(it => !(it.label === label && it.sel)); return true;
        }
        return wrong(x, y, label);
      }
      return checkAnswer(q, label) ? solved(x, y) : wrong(x, y, label);
    }
    function solved(x, y) {
      const r = st.report[st.i], q = q0();
      r.tries++; if (r.firstOk === null) r.firstOk = true; recordSub(true);
      st.combo++; const pts = (st.tries === 0 ? 100 : 50) * Math.min(4, st.combo); st.score += pts;
      el.querySelector('#mgscore').textContent = st.score;
      sfx(st.combo > 2 ? 'combo' : 'ok'); burst(x, y, '#f2c14e', 26); floatText(x, y - 20, `+${pts}${st.combo > 1 ? ' ×' + Math.min(4, st.combo) : ''}`, '#f2c14e');
      el.querySelector('#mgsent').innerHTML = sentenceHtml(q, st.built, true);
      const fb = el.querySelector('#mgfb'); fb.className = 'mg-fb ok'; fb.innerHTML = `✔ <b>Betul!</b> ${esc(q.exp)}`;
      st.calm = 99; st.items.forEach(it => (it.dead = 0.3));
      setTimeout(() => { st.i++; if (st.i < st.qs.length) setupQ(); else finish(); }, 1700);
      return true;
    }
    function wrong(x, y, label) {
      const r = st.report[st.i], q = q0();
      r.tries++; if (r.firstOk === null) r.firstOk = false; recordSub(false);
      st.tries++; st.combo = 0; sfx('bad'); burst(x, y, '#ff6b70', 14); floatText(x, y - 20, '✖ ' + label, '#ff9a9e');
      st.shake = 0.35;
      const fb = el.querySelector('#mgfb'); fb.className = 'mg-fb bad'; fb.innerHTML = `${['💡', '🔎', '📘'][Math.min(2, st.tries - 1)]} ${hintText(q, Math.min(3, st.tries))}`;
      return true;
    }
    // ---------- kesan ----------
    function burst(x, y, col, n) { for (let k = 0; k < n; k++) { const a = Math.random() * 6.28, s = 60 + Math.random() * 180; st.fx.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 0.6 + Math.random() * 0.4, col, r: 2 + Math.random() * 3 }); } }
    function floatText(x, y, txt, col) { st.fx.push({ x, y, vx: 0, vy: -50, t: 1.1, txt, col }); }
    // ---------- mod: helper ----------
    function chip(G, x, y, label, o = {}) {
      G.font = `900 ${o.size || 18}px Nunito`; const w = Math.max(54, G.measureText(label).width + 26), h = (o.size || 18) + 18;
      G.save(); G.translate(x, y); if (o.rot) G.rotate(o.rot); if (o.scale) G.scale(o.scale, o.scale);
      G.fillStyle = 'rgba(0,0,0,.3)'; rr(G, -w / 2 + 3, -h / 2 + 5, w, h, 10); G.fill();
      G.fillStyle = o.fill || '#fff4d6'; rr(G, -w / 2, -h / 2, w, h, 10); G.fill(); G.lineWidth = 3; G.strokeStyle = o.stroke || '#c9951f'; G.stroke();
      G.fillStyle = o.ink || '#2a1b40'; G.textAlign = 'center'; G.textBaseline = 'middle'; G.fillText(label, 0, 1); G.textBaseline = 'alphabetic';
      G.restore(); return { w, h };
    }
    const laneX = l => st.W / 2 + (l - 1) * Math.min(230, st.W * 0.26);
    function spawnChips(all) {
      const q = q0(), A = { x0: 40, x1: st.W - 40, y0: st.top + 40, y1: st.H - 40 };
      const labels = q.kind === 'reorder' ? pool().slice() : shuffle([...q.opts, ...q.opts, ...q.opts].slice(0, 5 + Math.min(stage, 2)));
      if (all) st.items = [];
      for (const label of labels) {
        let x, y, tries = 0;
        do { x = A.x0 + Math.random() * (A.x1 - A.x0); y = A.y0 + Math.random() * (A.y1 - A.y0); tries++; } while (tries < 30 && (Math.hypot(x - st.px, y - st.py) < 130 || st.items.some(it => Math.hypot(it.x - x, it.y - y) < 110)));
        st.items.push({ label, x, y, vx: (Math.random() - .5) * (20 + stage * 8), vy: (Math.random() - .5) * (20 + stage * 8), t: 0, sel: true });
      }
    }
    function setupHoles() {
      const cols = 3, rows = 2, aw = Math.min(st.W - 60, 760), ah = Math.min(st.H - st.top - 60, 340);
      st.holes = [];
      for (let j = 0; j < rows; j++) for (let k = 0; k < cols; k++) st.holes.push({ x: st.W / 2 - aw / 2 + aw * (k + 0.5) / cols, y: st.top + 40 + ah * (j + 0.6) / rows, item: null, n: j * cols + k + 1 });
    }
    function newCard() { const q = q0(); st.card = { x: st.W / 2, y: st.top + 56, vy: 34 + stage * 7, text: q.kind === 'correction' ? q.prompt : q.prompt.replace('___', '＿＿') }; }
    // ---------- kemas kini ----------
    function update(dt) {
      st.t += dt; if (st.calm > 0 && st.calm < 50) st.calm -= dt; if (st.stun > 0) st.stun -= dt; if (st.shake > 0) st.shake -= dt;
      const m = mode(), v = moveVec(), sp = dt;
      for (const f of st.fx) { f.x += f.vx * sp; f.y += f.vy * sp; if (!f.txt) f.vy += 260 * sp; f.t -= sp; }
      st.fx = st.fx.filter(f => f.t > 0);
      st.items.forEach(it => { if (it.dead) it.dead -= dt; }); st.items = st.items.filter(it => !(it.dead !== undefined && it.dead <= 0));
      if (m === 'tangkap') {
        if (st.drag == null) st.px += v.x * 520 * dt;
        st.px = clamp(st.px, 50, st.W - 50); st.pmove = Math.abs(v.x) > 0.1; if (st.pmove) st.pdir = v.x < 0 ? 'left' : 'right';
        st.spawnT -= dt;
        if (st.spawnT <= 0 && st.calm <= 0) { st.spawnT = Math.max(0.45, 1.05 - stage * 0.08); st.items.push({ label: nextLabel(), x: 50 + Math.random() * (st.W - 100), y: st.top + 10, vy: 95 + stage * 14 + Math.random() * 40, rot: (Math.random() - .5) * 0.4, sel: true }); }
        for (const it of st.items) {
          if (it.dead !== undefined) continue; it.y += it.vy * dt;
          if (Math.abs(it.x - st.px) < 64 && it.y > st.py - 128 * st.k && it.y < st.py - 84 * st.k) { it.dead = 0; pick(it.label, it.x, it.y); }
          if (it.y > st.H + 30) it.dead = 0;
        }
      } else if (m === 'gelembung') {
        st.spawnT -= dt;
        if (st.spawnT <= 0 && st.calm <= 0 && st.items.length < 9) { st.spawnT = Math.max(0.4, 0.8 - stage * 0.05); st.items.push({ label: nextLabel(), x: 60 + Math.random() * (st.W - 120), y: st.H + 40, vy: -(55 + stage * 9 + Math.random() * 30), ph: Math.random() * 6, r: 46 + Math.random() * 10, sel: true }); }
        for (const it of st.items) { if (it.dead !== undefined) continue; it.y += it.vy * dt; it.x += Math.sin(st.t * 2 + it.ph) * 30 * dt; if (it.y < st.top - 40) it.dead = 0; }
      } else if (m === 'larian') {
        st.scroll += dt * (220 + stage * 25);
        st.laneX += (laneX(st.lane) - st.laneX) * Math.min(1, dt * 14);
        if (input.joy.on && Math.abs(input.joy.x) > 0.6 && !st.joyLatch) { st.lane = clamp(st.lane + Math.sign(input.joy.x), 0, 2); st.joyLatch = true; sfx('whoosh'); }
        if (!input.joy.on || Math.abs(input.joy.x) < 0.3) st.joyLatch = false;
        st.spawnT -= dt;
        if (st.spawnT <= 0 && st.calm <= 0) {
          st.spawnT = Math.max(1.5, 2.4 - stage * 0.15);
          const q = q0(), lanes = shuffle([0, 1, 2]);
          let labels = q.kind === 'reorder' ? shuffle([expected(), ...shuffle(pool().filter(w => norm(w) !== norm(expected()))).slice(0, 1)]) : shuffle(q.opts.slice());
          labels.forEach((l, k) => st.items.push({ label: l, lane: lanes[k], y: st.top - 20, gate: true, sel: true }));
          if (labels.length < 3) st.items.push({ lane: lanes[2], y: st.top - 20, rock: true });
        }
        for (const it of st.items) {
          if (it.dead !== undefined) continue; it.y += dt * (220 + stage * 25);
          if (!it.hit && it.y > st.py - 30) {
            it.hit = true;
            if (it.lane === st.lane) { if (it.rock) { st.stun = 0.6; st.shake = 0.3; sfx('hurt'); floatText(st.laneX, st.py - 60, 'Aduh!', '#ff9a9e'); } else { it.dead = 0; pick(it.label, st.laneX, st.py - 40); } }
          }
          if (it.y > st.H + 60) it.dead = 0;
        }
        st.panim += dt * 12;
      } else if (m === 'sorong') {
        const cd = st.card; if (!cd || st.calm > 50) { /* menunggu */ } else if (st.calm <= 0) {
          if (st.drag == null) cd.x += v.x * 420 * dt;
          cd.x = clamp(cd.x, 120, st.W - 120); cd.y += cd.vy * dt;
          if (cd.y > st.H - 150) { const q = q0(), lbl = cd.x < st.W / 2 ? q.opts[0] : q.opts[1]; const ok = pick(lbl, cd.x, cd.y); if (st.calm < 50) newCard(); void ok; }
        }
      } else if (m === 'kutip') {
        if (st.stun <= 0) {
          let dx = v.x, dy = v.y;
          if (st.target && v.len < 0.1) { const tx = st.target.x - st.px, ty = st.target.y - st.py, d = Math.hypot(tx, ty); if (d > 8) { dx = tx / d; dy = ty / d; } else st.target = null; }
          st.px = clamp(st.px + dx * 260 * dt, 30, st.W - 30); st.py = clamp(st.py + dy * 260 * dt, st.top + 50, st.H - 20);
          st.pmove = Math.hypot(dx, dy) > 0.1; if (st.pmove) { st.pdir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'); st.panim += dt * 9; }
        }
        for (const it of st.items) {
          if (it.dead !== undefined) continue;
          it.x += it.vx * dt; it.y += it.vy * dt;
          if (it.x < 40 || it.x > st.W - 40) it.vx *= -1; if (it.y < st.top + 40 || it.y > st.H - 30) it.vy *= -1;
          if (st.calm <= 0 && st.pmove && Math.hypot(it.x - st.px, it.y - (st.py - 30)) < 46) {
            it.dead = 0; const before = st.tries; pick(it.label, it.x, it.y);
            if (st.tries > before) { it.dead = undefined; it.x = 40 + Math.random() * (st.W - 80); it.y = st.top + 50 + Math.random() * (st.H - st.top - 90); }
          }
        }
        for (const b of st.blobs) {
          b.x += b.vx * dt; b.y += b.vy * dt; if (b.x < 30 || b.x > st.W - 30) b.vx *= -1; if (b.y < st.top + 40 || b.y > st.H - 20) b.vy *= -1;
          if (st.stun <= 0 && Math.hypot(b.x - st.px, b.y - (st.py - 20)) < 40) { st.stun = 0.8; st.shake = 0.3; sfx('hurt'); floatText(st.px, st.py - 90, 'Terpalit dakwat!', '#c9b8ff'); const d = Math.hypot(st.px - b.x, st.py - b.y) || 1; st.px = clamp(st.px + (st.px - b.x) / d * 60, 30, st.W - 30); st.py = clamp(st.py + (st.py - b.y) / d * 60, st.top + 50, st.H - 20); }
        }
      } else if (m === 'ketuk') {
        st.spawnT -= dt;
        if (st.spawnT <= 0 && st.calm <= 0) {
          st.spawnT = Math.max(0.35, 0.7 - stage * 0.06);
          const free = st.holes.filter(h => !h.item); if (free.length) { const h = free[Math.floor(Math.random() * free.length)]; h.item = { label: nextLabel(0.4), t: 0, life: Math.max(1.1, 2 - stage * 0.15) }; }
        }
        for (const h of st.holes) if (h.item) { h.item.t += dt; if (h.item.t > h.item.life) h.item = null; }
      }
    }
    // ---------- lukisan ----------
    function drawBg() {
      const { W, H } = st;
      if (!bgCache || bgCache.w !== W || bgCache.h !== H) bgCache = blurredBg(bgSrc, W, H, 0.5);
      if (bgCache.c) G.drawImage(bgCache.c, 0, 0, W, H); else { G.fillStyle = '#14123a'; G.fillRect(0, 0, W, H); bgCache = null; }
    }
    function draw() {
      const { W, H } = st, m = mode();
      G.save();
      if (st.shake > 0) G.translate((Math.random() - .5) * 10, (Math.random() - .5) * 8);
      drawBg();
      if (!q0()) { G.restore(); return; }
      if (m === 'tangkap') {
        for (const it of st.items) if (it.dead === undefined) chip(G, it.x, it.y, it.label, { rot: it.rot });
        drawHero(G, 'amir', st.px, st.py + 30 * st.k, st.pmove ? st.pdir : 'down', st.pmove, st.t * 9, { h: 110 * st.k });
        const by = st.py - 112 * st.k; G.fillStyle = '#8a5a34'; G.beginPath(); G.moveTo(st.px - 62, by); G.lineTo(st.px + 62, by); G.lineTo(st.px + 48, by + 30); G.lineTo(st.px - 48, by + 30); G.fill(); G.fillStyle = '#a8723f'; G.fillRect(st.px - 62, by, 124, 7);
        G.strokeStyle = '#5a3a22'; G.lineWidth = 2; for (let k = -44; k <= 44; k += 16) { G.beginPath(); G.moveTo(st.px + k, by + 6); G.lineTo(st.px + k * 0.8, by + 28); G.stroke(); }
        G.fillStyle = '#f1c7a0'; G.fillRect(st.px - 50, by + 24, 8, 14); G.fillRect(st.px + 42, by + 24, 8, 14);
      } else if (m === 'gelembung') {
        for (const it of st.items) {
          if (it.dead !== undefined) continue;
          const g2 = G.createRadialGradient(it.x - it.r * .35, it.y - it.r * .4, 4, it.x, it.y, it.r);
          g2.addColorStop(0, 'rgba(255,255,255,.95)'); g2.addColorStop(0.35, 'rgba(160,220,255,.45)'); g2.addColorStop(1, 'rgba(120,140,255,.25)');
          G.fillStyle = g2; G.beginPath(); G.arc(it.x, it.y, it.r, 0, 7); G.fill(); G.strokeStyle = 'rgba(255,255,255,.8)'; G.lineWidth = 2; G.stroke();
          G.fillStyle = '#1d1640'; G.font = '900 18px Nunito'; G.textAlign = 'center'; G.textBaseline = 'middle'; G.fillText(it.label, it.x, it.y + 2); G.textBaseline = 'alphabetic';
        }
      } else if (m === 'larian') {
        const rw = Math.min(230, W * 0.26) * 3 + 40, rx = W / 2 - rw / 2, sc = st.scroll;
        const road = stage === 4 ? ['#cfc6dc', '#b9b0cc', '#8c84a6'] : stage === 5 ? ['#5a4690', '#4c3b7c', '#2e2350'] : ['#d6b27a', '#c49c62', '#8a6a3c'];
        G.fillStyle = road[2]; G.fillRect(rx - 14, st.top, rw + 28, H - st.top);
        G.fillStyle = road[0]; G.fillRect(rx, st.top, rw, H - st.top);
        for (let y = (sc % 48) + st.top - 48; y < H; y += 48) for (let k = 0; k < 9; k++) { G.fillStyle = road[1]; G.fillRect(rx + ((k * 97 + Math.floor((y - sc) / 48) * 31) % rw), y + (k * 13) % 40, 6, 4); }
        G.fillStyle = 'rgba(255,255,255,.35)'; for (let y = (sc % 70) + st.top - 70; y < H; y += 70) { G.fillRect(rx + rw / 3 - 3, y, 6, 34); G.fillRect(rx + 2 * rw / 3 - 3, y, 6, 34); }
        const tree = (x, y) => { G.fillStyle = 'rgba(0,0,0,.3)'; G.beginPath(); G.ellipse(x + 4, y + 30, 30, 9, 0, 0, 7); G.fill(); G.fillStyle = '#6b4426'; G.fillRect(x - 6, y, 12, 30);
          G.fillStyle = '#1d4a22'; G.beginPath(); G.arc(x, y - 10, 36, 0, 7); G.fill(); G.fillStyle = stage === 5 ? '#7a4fc8' : '#3f9444'; G.beginPath(); G.arc(x, y - 12, 33, 0, 7); G.fill();
          G.fillStyle = stage === 5 ? '#a57cf0' : '#6cc25a'; G.beginPath(); G.arc(x - 9, y - 20, 18, 0, 7); G.fill(); G.fillStyle = 'rgba(255,255,255,.25)'; G.beginPath(); G.arc(x - 14, y - 26, 7, 0, 7); G.fill(); };
        for (let y = (sc % 160) + st.top - 160; y < H + 60; y += 160) { if (rx > 60) { tree(rx - 50, y); tree(rx + rw + 50, y + 80); } }
        for (const it of st.items) {
          if (it.dead !== undefined) continue; const x = laneX(it.lane);
          if (it.rock) { G.fillStyle = 'rgba(0,0,0,.3)'; G.beginPath(); G.ellipse(x + 5, it.y + 14, 42, 12, 0, 0, 7); G.fill(); G.fillStyle = '#5e5a70'; G.beginPath(); G.ellipse(x, it.y, 40, 28, 0, 0, 7); G.fill(); G.fillStyle = '#8c88a0'; G.beginPath(); G.ellipse(x - 8, it.y - 8, 22, 12, 0, 0, 7); G.fill(); continue; }
          const pw = 112, glow = 0.35 + 0.2 * Math.sin(st.t * 6);
          G.fillStyle = `rgba(190,140,255,${glow})`; G.fillRect(x - pw / 2, it.y - 62, pw, 66);
          for (const sx of [-1, 1]) { G.fillStyle = '#4a2c18'; G.fillRect(x + sx * (pw / 2 + 4) - 7, it.y - 84, 14, 90); G.fillStyle = '#7a4a2a'; G.fillRect(x + sx * (pw / 2 + 4) - 5, it.y - 84, 6, 90); G.fillStyle = '#f2c14e'; G.beginPath(); G.arc(x + sx * (pw / 2 + 4), it.y - 88, 6, 0, 7); G.fill(); }
          G.fillStyle = '#5a2a20'; G.fillRect(x - pw / 2 - 10, it.y - 88, pw + 20, 10);
          chip(G, x, it.y - 104, it.label, { size: 19 });
        }
        drawHero(G, 'amir', st.laneX, st.py + 30 * st.k, st.stun > 0 ? 'down' : 'up', st.stun <= 0, st.panim, { h: 110 * st.k, alpha: st.stun > 0 ? 0.6 : 1 });
        drawHero(G, 'aisyah', st.laneX - 50 * st.k, st.py + 66 * st.k, 'up', true, st.panim + 1, { h: 96 * st.k, alpha: 0.85 });
      } else if (m === 'sorong') {
        const q = q0(), bw = Math.min(260, W * 0.36), by = H - 120;
        q.opts.forEach((o, k) => {
          const x = k === 0 ? W / 4 : (3 * W) / 4, hot = st.card && ((k === 0) === (st.card.x < W / 2));
          G.fillStyle = hot ? 'rgba(242,193,78,.35)' : 'rgba(30,30,70,.75)'; rr(G, x - bw / 2, by, bw, 100, 16); G.fill(); G.lineWidth = 4; G.strokeStyle = hot ? '#f2c14e' : '#6a6fb8'; G.stroke();
          G.fillStyle = '#f2c14e'; G.font = '900 30px Nunito'; G.textAlign = 'center'; G.fillText(o.toUpperCase(), x, by + 62);
        });
        G.strokeStyle = 'rgba(255,255,255,.15)'; G.setLineDash([8, 8]); G.beginPath(); G.moveTo(W / 2, st.top); G.lineTo(W / 2, H); G.stroke(); G.setLineDash([]);
        if (st.card) { G.font = '800 18px Nunito'; const tw = Math.min(W - 60, G.measureText(st.card.text).width + 40); G.save(); G.translate(st.card.x, st.card.y); G.rotate((st.card.x - W / 2) / W * 0.3);
          G.fillStyle = 'rgba(0,0,0,.35)'; rr(G, -tw / 2 + 4, -26, tw, 56, 10); G.fill(); G.fillStyle = '#fff4d6'; rr(G, -tw / 2, -30, tw, 56, 10); G.fill(); G.strokeStyle = '#c9951f'; G.lineWidth = 3; G.stroke();
          G.fillStyle = '#2a1b40'; G.textAlign = 'center'; G.fillText(st.card.text, 0, 4, tw - 20); G.restore(); }
      } else if (m === 'kutip') {
        G.fillStyle = stage === 5 ? 'rgba(60,40,110,.45)' : 'rgba(60,120,60,.35)'; G.fillRect(0, st.top, W, H - st.top);
        for (const b of st.blobs) { G.fillStyle = '#231a3f'; G.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28, r = 26 + Math.sin(st.t * 5 + k * 2) * 5; G.lineTo(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r); } G.fill(); G.fillStyle = '#fff'; G.fillRect(b.x - 9, b.y - 6, 6, 6); G.fillRect(b.x + 4, b.y - 6, 6, 6); }
        for (const it of st.items) if (it.dead === undefined) chip(G, it.x, it.y + Math.sin(st.t * 3 + it.x) * 3, it.label, { fill: '#f3ead2' });
        if (st.target) { G.strokeStyle = 'rgba(242,193,78,.7)'; G.lineWidth = 2; G.beginPath(); G.ellipse(st.target.x, st.target.y, 14, 6, 0, 0, 7); G.stroke(); }
        drawHero(G, 'amir', st.px, st.py, st.pmove ? st.pdir : 'down', st.pmove, st.panim, { h: 96 * st.k, alpha: st.stun > 0 ? 0.55 + 0.4 * Math.sin(st.t * 30) : 1 });
      } else if (m === 'ketuk') {
        for (const h of st.holes) {
          G.fillStyle = '#2a1b10'; G.beginPath(); G.ellipse(h.x, h.y + 26, 86, 26, 0, 0, 7); G.fill(); G.fillStyle = '#120a06'; G.beginPath(); G.ellipse(h.x, h.y + 26, 72, 18, 0, 0, 7); G.fill();
          if (h.item) { const k = Math.min(1, h.item.t * 6, (h.item.life - h.item.t) * 6); G.save(); G.beginPath(); G.rect(h.x - 100, h.y - 90, 200, 116); G.clip(); chip(G, h.x, h.y + 26 - 44 * k, h.item.label, { size: 20 }); G.restore(); }
          if (!isTouch) { G.fillStyle = 'rgba(255,255,255,.5)'; G.font = '800 13px Nunito'; G.textAlign = 'center'; G.fillText(h.n, h.x, h.y + 66); }
        }
      }
      for (const f of st.fx) { if (f.txt) { G.globalAlpha = Math.min(1, f.t); G.fillStyle = f.col; G.font = '900 22px Nunito'; G.textAlign = 'center'; G.fillText(f.txt, f.x, f.y); G.globalAlpha = 1; } else { G.fillStyle = f.col; G.globalAlpha = Math.min(1, f.t * 2); G.fillRect(f.x - f.r / 2, f.y - f.r / 2, f.r, f.r); G.globalAlpha = 1; } }
      G.restore();
    }
    // ---------- input ----------
    const ptr = e => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    c.onpointerdown = e => {
      const p = ptr(e), m = mode();
      if (m === 'gelembung') { for (let k = st.items.length - 1; k >= 0; k--) { const it = st.items[k]; if (it.dead === undefined && Math.hypot(it.x - p.x, it.y - p.y) < it.r + 6) { it.dead = 0; burst(it.x, it.y, '#bfe9ff', 12); pick(it.label, it.x, it.y); break; } } }
      else if (m === 'ketuk') { for (const h of st.holes) if (h.item && Math.abs(p.x - h.x) < 80 && p.y > h.y - 50 && p.y < h.y + 50) { const l = h.item.label; h.item = null; pick(l, h.x, h.y - 20); break; } }
      else if (m === 'larian') { if (p.y > st.top) { st.lane = clamp(st.lane + (p.x < st.W / 2 ? -1 : 1), 0, 2); sfx('whoosh'); } }
      else if (m === 'tangkap' || m === 'sorong') { st.drag = p.x; c.setPointerCapture(e.pointerId); if (m === 'tangkap') st.px = p.x; }
      else if (m === 'kutip') { st.target = { x: p.x, y: p.y + 30 }; }
    };
    c.onpointermove = e => { if (st.drag == null) return; const p = ptr(e), m = mode(); if (m === 'tangkap') st.px = p.x; else if (m === 'sorong' && st.card) st.card.x += p.x - st.drag; st.drag = p.x; };
    c.onpointerup = c.onpointercancel = () => { st.drag = null; };
    MG.onKey = k => {
      const m = mode();
      if (m === 'larian' && (k === 'a' || k === 'ArrowLeft')) { st.lane = Math.max(0, st.lane - 1); sfx('whoosh'); }
      if (m === 'larian' && (k === 'd' || k === 'ArrowRight')) { st.lane = Math.min(2, st.lane + 1); sfx('whoosh'); }
      if (m === 'ketuk' && /^[1-6]$/.test(k)) { const h = st.holes[Number(k) - 1]; if (h && h.item) { const l = h.item.label; h.item = null; pick(l, h.x, h.y - 20); } }
      if (k === 'Escape') el.querySelector('#mgx').click();
    };
    // ---------- tamat ----------
    function finish() {
      st.done = true; MG.on = false;
      const first = st.report.filter(r => r.firstOk).length, tries = st.report.reduce((s, r) => s + r.tries, 0);
      $('#touch').classList.add('hidden');
      const box = document.createElement('div'); box.className = 'mg-end';
      box.innerHTML = `<div class="panel" style="width:min(760px,100%)"><div class="panel-head"><h2>🏁 ${esc(cfg.title)} selesai!</h2><span class="stat">⭐ ${st.score}</span></div><div class="panel-body">
        <p style="margin-top:0">Betul pada cubaan pertama: <b>${first}/${st.qs.length}</b> · Jawapan dihantar: <b>${tries}</b></p>
        <table class="rep"><tr><th>#</th><th>Ayat</th><th>Cubaan</th><th>Peraturan</th></tr>
        ${st.report.map((r, k) => `<tr><td>${k + 1}</td><td>${esc(r.q.canon)}</td><td>${r.firstOk ? '✔ 1' : '↻ ' + r.tries}</td><td class="muted">${esc(RULE_LABEL[r.q.rule])}</td></tr>`).join('')}</table></div>
        <div class="panel-foot"><button class="primary" id="mgdone">Teruskan ▸</button></div></div>`;
      el.appendChild(box);
      box.querySelector('#mgdone').onclick = () => { close(); resolve({ report: st.report, score: st.score }); };
    }
    function close() { MG.on = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); el.classList.add('hidden'); el.innerHTML = ''; $('#touch').classList.add('hidden'); setMode('play'); hudUpdate(); }
    el.querySelector('#mgx').onclick = async () => {
      const was = st.calm; st.calm = 999;
      if (await confirmBox('Keluar daripada mini-game?', 'Kemajuan set ini tidak disimpan. Misi kekal <b>dalam proses</b>.', 'Keluar', 'Teruskan')) { close(); resolve(null); }
      else st.calm = was;
    };
    addEventListener('resize', resize);
    let raf = 0, last = performance.now();
    const loop = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!st.done) update(dt); draw(); raf = requestAnimationFrame(loop); };
    setupQ(); raf = requestAnimationFrame(loop);
    MG.debugTick = dt => { update(dt); draw(); };
    MG.testPick = l => pick(l, st.W / 2, st.H / 2); MG.expected = expected; // cangkuk ujian automatik
  });
}
