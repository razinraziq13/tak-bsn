// TAK BSN — antara muka: dialog, misi, kuiz, bos, menu, prolog & epilog.
'use strict';


const UI = {
  mode: 'title', scene: null,
  markerFor(p) {
    if (!S.magic) return p.id === 'rak1' ? '!' : null;
    if (p.id.startsWith('boss')) { const n = Number(p.id.slice(4)); return stageUnlocked(n) && stageDone(n) && !(S.bosses[n] && S.bosses[n].won) ? '!' : null; }
    if (p.id === 'bas') return S.savings >= CONFIG.upsiCost && !S.registered ? '!' : null;
    if (p.id === 'pegawai') return !S.registered ? '!' : null;
    const q = QUESTS.find(x => x.giver === p.id);
    if (q) { const st = questStatus(q.id); if (st === 'tersedia') return '!'; if (st === 'dalam_proses') return '?'; }
    return null;
  },
};
function setMode(m) {
  UI.mode = m; document.body.dataset.mode = m;
  if (m === 'play') { $('#touch').classList.toggle('hidden', !isTouch); $('#actBtn').classList.remove('hidden'); }
  else if (m !== 'minigame' && m !== 'boss') $('#touch').classList.add('hidden');
}

// ---------- HUD ----------
function objective() {
  if (!S.magic) return { text: 'Pergi ke <b>Perpustakaan Lama</b> bersama Aisyah.', area: 'hub', point: 'rak1' };
  if (world.areaId === 'upsi' && !S.registered) return { text: 'Bercakap dengan <b>Pegawai Pendaftaran</b> di kaunter.', area: 'upsi', point: 'pegawai' };
  if (S.tracked && ['tersedia', 'dalam_proses'].includes(questStatus(S.tracked))) {
    const q = QUEST_BY_ID[S.tracked];
    return { text: `Dijejak: <b>${q.name}</b> · ${q.place}`, area: STAGE_AREA[q.stage], point: q.giver };
  }
  const n = currentStage();
  if (!(S.bosses[n] && S.bosses[n].won)) {
    if (stageDone(n)) return { text: `Bos dibuka: <b>${BOSSES[n].name}</b>! Pergi ke bulatan rune.`, area: STAGE_AREA[n], point: BOSSES[n].gate };
    const left = stageQuests(n).filter(q => questStatus(q.id) !== 'selesai');
    return { text: `Tahap ${n}: misi <b>${5 - left.length}/5</b>. Cari tanda <b>!</b>`, area: STAGE_AREA[n], point: left[0].giver };
  }
  if (!S.registered) {
    if (S.savings >= CONFIG.upsiCost) return { text: 'Tabung cukup! Pergi ke <b>Hentian Bas ke UPSI</b>.', area: 'hub', point: 'bas' };
    return { text: `Simpan token di <b>Bank Impian</b> (${S.savings}/${CONFIG.upsiCost}). Ulang latihan sampingan untuk token.`, area: 'hub', point: 'bank' };
  }
  return { text: '🎓 Impian tercapai! Teruskan meneroka & berlatih.', area: null };
}
function hudUpdate() {
  if (!world.area) return;
  $('#hudArea').textContent = world.area.stage ? `${world.area.name} · Tahap ${world.area.stage}` : world.area.name;
  $('#hudWallet').textContent = S.wallet;
  $('#hudObj').innerHTML = objective().text;
}
function compassUpdate() {
  const c = $('#compass');
  if (UI.mode !== 'play' || !world.player) { c.classList.add('hidden'); return; }
  const o = objective();
  if (!o.area) { c.classList.add('hidden'); return; }
  let target, label = '';
  if (o.area === world.areaId) target = world.points.find(p => p.id === o.point);
  else { target = world.points.find(p => PORTAL_IDS.has(p.id)); label = `→ ${AREAS[o.area].name} (Peta)`; }
  if (!target) { c.classList.add('hidden'); return; }
  c.classList.remove('hidden');
  const ang = Math.atan2(target.y - world.player.y, target.x - world.player.x) + Math.PI / 2;
  c.querySelector('.needle').style.transform = `rotate(${ang}rad)`;
  c.querySelector('small').textContent = label;
}

// ---------- Dialog ----------
let dlgBtns = [];
function who2(who) {
  if (who && typeof who === 'object') return who;
  if (!who) return { name: '', portrait: null };
  return { name: NAMES[who] || who, portrait: PORTRAITS[who] || null };
}
function ask(who, text, choices) {
  return new Promise(res => {
    const w = who2(who), prev = UI.mode;
    setMode('dialog');
    const d = $('#dialog'); d.classList.remove('hidden');
    const pe = $('#dlgPortrait');
    pe.className = w.portrait ? '' : 'none'; if (w.portrait) pe.style.backgroundImage = `url(${w.portrait})`;
    $('#dlgName').textContent = w.name; $('#dlgName').style.display = w.name ? '' : 'none';
    $('#dlgText').innerHTML = text;
    const box = $('#dlgChoices'); box.innerHTML = '';
    dlgBtns = choices.map((c, i) => {
      const b = document.createElement('button'); b.textContent = c; if (i === 0) b.className = 'primary';
      b.onclick = () => { sfx('click'); d.classList.add('hidden'); dlgBtns = []; setMode(prev === 'dialog' || prev === 'title' ? 'play' : prev); res(i); };
      box.appendChild(b); return b;
    });
    sfx('talk');
  });
}
const say = (who, text) => ask(who, text, ['Seterusnya ▸']);
async function talk(lines) { for (const [w, t] of lines) await say(w, t); }

// ---------- Modal ----------
function openModal(html, mode = 'modal') {
  const m = $('#modal'); m.innerHTML = html; m.classList.remove('hidden'); setMode(mode);
  const cb = m.querySelector('[data-close]'); if (cb) cb.onclick = closeModal;
  return m;
}
function closeModal() { $('#modal').classList.add('hidden'); $('#modal').innerHTML = ''; setMode('play'); hudUpdate(); }
function panel(title, body, foot = '') {
  return `<div class="panel"><div class="panel-head"><h2>${title}</h2><button class="ghost" data-close>✕</button></div>${body}${foot ? `<div class="panel-foot">${foot}</div>` : ''}</div>`;
}
function confirmBox(title, text, yes = 'Ya', no = 'Batal') {
  return new Promise(res => {
    const prev = UI.mode;
    const wrap = document.createElement('div'); wrap.id = 'confirm';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:80;display:grid;place-items:center;background:rgba(5,5,20,.6);padding:10px';
    wrap.innerHTML = `<div class="panel" style="width:min(520px,100%)"><div class="panel-head"><h2>${title}</h2></div><div class="panel-body">${text}</div><div class="panel-foot"><button class="ghost" data-n>${no}</button><button class="primary" data-y>${yes}</button></div></div>`;
    document.body.appendChild(wrap); UI.mode = 'confirm';
    const done = v => { wrap.remove(); UI.mode = prev; res(v); };
    wrap.querySelector('[data-y]').onclick = () => done(true);
    wrap.querySelector('[data-n]').onclick = () => done(false);
  });
}

// ---------- Interaksi ----------
const GREET = {
  razin: 'Selamat datang ke Kedai Buku! Buku apa yang kamu cari hari ini?',
  izhan: 'Hai Amir! Kios saya ada power-up, kosmetik dan barang koleksi.',
  hazim: 'Taman ini saya jaga setiap hari. Hati-hati, jangan pijak bunga!',
  nazhif: 'Amir, belajar sedikit setiap hari lebih baik daripada banyak sekali-sekala.',
  kelvin: 'Komputer makmal sudah saya baiki. Ada cabaran kod kalau kamu berani!',
  rakan: 'Hai Amir! Kami sedang berlatih dialog untuk kelas Bahasa Melayu.',
};
async function act() {
  const p = world.near; if (!p || UI.mode !== 'play') return;
  try { await interact(p); } finally { hudUpdate(); }
}
async function interact(p) {
  const id = p.id;
  if (PORTAL_IDS.has(id)) return openMap();
  if (id === 'bas') return busStop();
  if (id === 'bank') return openBank();
  if (id === 'rumah') return say('amir', 'Rumah saya. Ibu selalu pesan: belajar rajin-rajin, impian pasti tercapai!');
  if (id.startsWith('boss')) return bossGate(Number(id.slice(4)));
  if (id === 'pegawai') return registrar();
  if (id === 'papanupsi') return say({ name: 'Papan Maklumat' }, 'Kampus ini ialah <b>gambaran fiksyen</b> berilhamkan suasana kampus di Tanjong Malim, Perak. Pendaftaran di sini ialah <b>simulasi permainan sahaja</b> — bukan tawaran, yuran atau proses rasmi universiti.');
  if (id === 'rak1' && !S.magic) return discoverBook();

  const isNpc = p.type === 'npc';
  const who = isNpc ? (id === 'rakan' ? { name: 'Rakan Kelas' } : id) : { name: p.name };
  if (!S.magic) {
    if (id === 'izhan') { const c = await ask(who, GREET.izhan, ['Kedai Token', 'Tutup']); if (c === 0) openShop(); return; }
    await say(who, isNpc ? GREET[id] || 'Hai!' : 'Tiada apa-apa yang pelik di sini… buat masa ini.');
    return say('aisyah', 'Jom ke Perpustakaan Lama dulu, Amir. Ikut kompas di atas skrin!');
  }
  const quest = QUESTS.find(q => q.giver === id);
  const side = Object.entries(SIDE).find(([, s]) => s.giver === id);
  const choices = [];
  if (quest && questStatus(quest.id) !== 'dikunci') {
    const st = questStatus(quest.id);
    choices.push({ label: `${st === 'selesai' ? '✓ ' : st === 'dalam_proses' ? '▶ ' : '! '}${quest.name}`, fn: () => questInteract(quest, who) });
  }
  if (side) choices.push({ label: `↻ ${side[1].name} (+${side[1].reward})`, fn: () => sideInteract(side[0], who) });
  if (id === 'izhan') choices.push({ label: '🛒 Kedai Token', fn: openShop });
  if (!choices.length) return say(who, isNpc ? GREET[id] || 'Hai!' : 'Tiada apa-apa di sini buat masa ini.');
  if (choices.length === 1 && !isNpc) return choices[0].fn();
  const c = await ask(who, isNpc ? GREET[id] || 'Hai!' : `${p.name}. Apa yang ingin kamu lakukan?`, choices.map(c => c.label).concat('Tutup'));
  if (c < choices.length) return choices[c].fn();
}
async function questInteract(q, who) {
  const st = questStatus(q.id), reward = CONFIG.questReward[q.stage];
  if (st === 'selesai') return say(who, `Terima kasih, Amir! “${q.name}” sudah selesai. Kamu semakin mahir!`);
  if (st === 'dalam_proses') {
    const c = await ask(who, `Misi “${q.name}” sedang berjalan. Mahu teruskan sekarang?`, ['Mula Sekarang', 'Nanti']);
    if (c === 0) return runQuest(q);
    S.tracked = q.id; save(); return;
  }
  const c = await ask(who, `${q.offer}<br><span class="muted">📍 ${q.place} · 5 soalan · Ganjaran ${reward} token</span>`, ['Terima Misi', 'Tolak Misi']);
  if (c !== 0) return say(who, 'Tidak mengapa. Datang semula bila kamu sudah bersedia.');
  S.quests[q.id] = { status: 'active', acceptedAt: Date.now() }; S.tracked = q.id; save(); hudUpdate();
  toast(`Misi diterima: ${q.name}`);
  return runQuest(q);
}
async function sideInteract(key, who) {
  const s = SIDE[key];
  const c = await ask(who, `${s.name}: ${s.desc}. Boleh diulang bila-bila masa, ganjaran tetap <b>${s.reward} token</b> setiap kali selesai.`, ['Mula Latihan', 'Tutup']);
  if (c !== 0) return;
  const pool = QBANK.filter(q => s.stages.includes(q.stage) && s.kinds.includes(q.kind));
  const qs = shuffle(pool).slice(0, 5);
  const modes = ['tangkap', 'gelembung', 'larian', 'kutip', 'ketuk'];
  const rep = await runMinigame({ title: s.name, sub: 'Latihan sampingan (boleh diulang)', questions: qs, mode: modes[Math.floor(Math.random() * modes.length)], stage: Math.max(...s.stages.filter(stageUnlocked).concat(1)) });
  if (!rep) return;
  S.sideRuns++;
  credit(s.reward, 'side_quest_reward', `${key}:${Date.now()}`);
}
async function runQuest(q) {
  const rep = await runMinigame({ title: q.name, sub: `Tahap ${q.stage} · ${q.place}`, questions: QBY_OWNER[q.id], mode: q.mode, stage: q.stage });
  if (!rep) { hudUpdate(); return; }
  const st = S.quests[q.id] || {};
  if (!st.rewarded) {
    S.quests[q.id] = Object.assign(st, { status: 'done', completedAt: Date.now(), rewarded: true });
    credit(CONFIG.questReward[q.stage], 'quest_reward', q.id);
  }
  if (S.tracked === q.id) S.tracked = null;
  award('langkah');
  save(); hudUpdate();
  if (stageDone(q.stage) && !(S.bosses[q.stage] && S.bosses[q.stage].won)) {
    await say('aisyah', `Hebat! Kelima-lima misi Tahap ${q.stage} sudah selesai. Halaman rosak itu sedang menunggu — <b>${BOSSES[q.stage].name}</b> kini boleh dicabar di bulatan rune!`);
  }
}

// ---------- Panel: Peta ----------
function areaStatus(id) {
  const a = AREAS[id];
  if (id === 'upsi') return S.registered ? 'selesai' : S.savings >= CONFIG.upsiCost ? 'tersedia' : 'dikunci';
  if (!stageUnlocked(a.stage)) return 'dikunci';
  if (S.bosses[a.stage] && S.bosses[a.stage].won) return 'selesai';
  return stageQuests(a.stage).some(q => questStatus(q.id) !== 'tersedia') ? 'dalam_proses' : 'tersedia';
}
const ST_LABEL = { dikunci: 'Dikunci', tersedia: 'Tersedia', dalam_proses: 'Dalam proses', selesai: 'Selesai' };
function openMap() {
  const rows = AREA_ORDER.map(id => {
    const a = AREAS[id], st = areaStatus(id), here = world.areaId === id;
    const why = st !== 'dikunci' ? '' : id === 'upsi' ? `Perlu ${CONFIG.upsiCost} token dalam Bank Impian (kini ${S.savings}).` : `Kalahkan ${BOSSES[a.stage - 1].name} dahulu.`;
    const thumb = a.stage ? `background-image:url(assets/bg/stage${a.stage}.jpg)` : 'background:linear-gradient(#f7d58a,#78c46a)';
    return `<div class="card" style="display:flex;gap:10px;align-items:center"><div style="width:96px;height:56px;border-radius:8px;${thumb};background-size:cover;background-position:center;flex:0 0 96px;${st === 'dikunci' ? 'filter:grayscale(1) brightness(.5)' : ''}"></div>
      <div style="flex:1;min-width:0"><h3>${a.stage ? `Tahap ${a.stage} · ` : ''}${a.name}</h3><span class="pill st-${st}">${ST_LABEL[st]}</span> <span class="muted" style="font-size:12px">${why}</span></div>
      <button ${st === 'dikunci' || here ? 'disabled' : ''} data-go="${id}">${here ? 'Di sini' : 'Pergi'}</button></div>`;
  }).join('');
  const m = openModal(panel('🗺️ Peta Pengembaraan', `<div class="panel-body"><div class="grid2">${rows}</div><p class="muted" style="font-size:12px;margin-top:10px">Tahap seterusnya dibuka selepas bos tahap sebelumnya ditewaskan. Kampus UPSI dibuka apabila Tabung Universiti ≥ ${CONFIG.upsiCost} token.</p></div>`));
  m.querySelectorAll('[data-go]').forEach(b => (b.onclick = () => { closeModal(); travel(b.dataset.go); }));
}
async function travel(id) {
  if (id === 'upsi' && !S.registered) {
    if (S.savings < CONFIG.upsiCost) return;
    await timeSkip();
  }
  flash('#000', 300);
  setTimeout(() => { enterArea(id); toast(AREAS[id].name); }, 200);
}
async function busStop() {
  if (S.registered || S.savings >= CONFIG.upsiCost) {
    const c = await ask({ name: 'Hentian Bas ke UPSI' }, S.registered ? 'Bas ke Kampus UPSI. Mahu melawat kampus semula?' : `Tabung Universiti kamu: <b>${S.savings}</b> token. Kamu sudah layak memilih untuk ke Kampus UPSI. Pendaftaran adalah <b>pilihan kamu sendiri</b> — tiada paksaan.`, ['Naik Bas', 'Kembali Kemudian']);
    if (c === 0) travel('upsi');
    return;
  }
  return say({ name: 'Hentian Bas ke UPSI' }, `Bas ke Kampus UPSI hanya untuk yang sudah bersedia. Simpan <b>${CONFIG.upsiCost} token</b> dalam Bank Impian dahulu (kini ${S.savings}).`);
}
function timeSkip() {
  return new Promise(res => {
    setMode('screen'); playMusic('upsi');
    const sc = $('#screen'); sc.className = ''; sc.style.backgroundImage = 'none'; sc.style.background = '#000';
    sc.innerHTML = `<div><div class="cine-text">Beberapa tahun kemudian…</div><p style="max-width:620px;margin:16px auto;font-size:16px;line-height:1.5">Amir telah menamatkan persekolahannya dan, dalam cerita ini, memenuhi syarat untuk menyambung pengajian. Dengan Tabung Universiti yang dikumpul sejak Tingkatan 2, dia tiba di sebuah kampus di Tanjong Malim…</p><p class="disclaimer">Lompatan masa fiksyen. Amir dalam pengembaraan kekal murid Tingkatan 2.</p><button class="primary" id="tsGo">Teruskan ▸</button></div>`;
    sc.querySelector('#tsGo').onclick = () => { sc.className = 'hidden'; sc.style.background = ''; setMode('play'); res(); };
  });
}

// ---------- UPSI ----------
async function registrar() {
  if (S.registered) {
    const c = await ask('pegawai', 'Selamat kembali! Pendaftaran kamu sudah direkodkan. Mahu tonton semula detik itu?', ['Tonton Semula', 'Tutup']);
    if (c === 0) playEnding(true);
    return;
  }
  if (S.savings < CONFIG.upsiCost) return say('pegawai', `Tabung Universiti kamu kini ${S.savings}/${CONFIG.upsiCost} token. Kembali selepas simpanan mencukupi, ya.`);
  await say('pegawai', 'Selamat datang ke UPSI, Amir. Adakah kamu ingin meneruskan pendaftaran dalam pengembaraan ini?');
  if (pagesRestored() < 5) await say('aisyah', `Buku Misteri baru pulih ${pagesRestored()}/5 halaman. Kamu tetap boleh mendaftar — dan kita boleh kembali menyiapkan buku itu kemudian.`);
  const c = await ask('amir', 'Ya, saya bersedia!', ['Daftar Sekarang', 'Kembali Kemudian']);
  if (c !== 0) return;
  const ok = await confirmBox('Pengesahan Pendaftaran', `<p>Gunakan <b>${CONFIG.upsiCost} token</b> daripada Tabung Universiti untuk <b>pendaftaran simulasi</b>?</p><p class="muted" style="font-size:13px">Simulasi pendidikan dalam permainan sahaja — bukan tawaran kemasukan, yuran atau proses rasmi UPSI. Tiada wang sebenar.</p>`, 'Sahkan', 'Batal');
  if (!ok || S.registered) return;
  if (S.savings < CONFIG.upsiCost) { const g = await ask('pegawai', 'Maaf, baki tabung kamu tidak mencukupi sekarang. Mahu pulang ke Bank Impian?', ['Ke Bank Impian', 'Tutup']); if (g === 0) travel('hub'); return; }
  S.savings -= CONFIG.upsiCost; ledger('university_payment', -CONFIG.upsiCost, 'once');
  S.registered = true; S.registeredAt = Date.now(); award('impian'); save(); hudUpdate();
  playEnding(false);
}
function playEnding(replay) {
  setMode('screen'); UI.scene = 'ending'; UI.sceneT = 0; playMusic('win'); sfx('win');
  const sc = $('#screen'); sc.className = 'clear'; sc.style.backgroundImage = 'none';
  const lines = [
    ['amir', 'Aisyah, akhirnya impian aku untuk belajar di UPSI menjadi kenyataan!'],
    ['aisyah', 'Usaha dan ilmu yang kau kumpulkan membawamu sejauh ini, Amir!'],
  ];
  let k = 0;
  const box = () => {
    if (k < lines.length) {
      const [w, t] = lines[k];
      sc.innerHTML = `<div style="position:fixed;left:50%;bottom:24px;transform:translateX(-50%);width:min(760px,calc(100vw - 28px));background:rgba(22,23,58,.92);border:3px solid var(--gold2);border-radius:16px;padding:14px 16px;text-align:left"><div style="font-family:var(--pix);color:var(--gold)">${NAMES[w]}</div><div style="font-size:17px;margin:6px 0 10px">${t}</div><div style="text-align:right"><button class="primary" id="enx">Seterusnya ▸</button></div></div>`;
      sc.querySelector('#enx').onclick = () => { k++; box(); };
    } else {
      sc.innerHTML = `<div style="background:rgba(10,8,30,.55);padding:22px;border-radius:20px"><div class="cine-text">TAHNIAH!<br>IMPIAN AMIR TERCAPAI!</div><p class="disclaimer" style="color:#fff">Pendaftaran dan token adalah simulasi permainan sahaja.</p><button class="primary" id="enb" style="margin-top:12px">Kembali Mengembara ▸</button></div>`;
      sc.querySelector('#enb').onclick = () => {
        S.endingSeen = true; save(); UI.scene = null; sc.className = 'hidden'; sc.style.background = '';
        setMode('play'); enterArea('hub'); toast('Mod pascacerita: teruskan meneroka & berlatih!');
      };
    }
  };
  setTimeout(box, S.settings.reduce ? 100 : 1400);
}
function drawEnding(dt) {
  UI.sceneT += dt; const t = UI.sceneT;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const W = cv.width, H = cv.height, s = Math.min(W / 640, H / 360);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffb86b'); g.addColorStop(0.55, '#ffe2a8'); g.addColorStop(1, '#fff4d6');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-320, -180);
  const pan = Math.min(1, t / 6) * 40;
  ctx.fillStyle = 'rgba(255,240,180,.8)'; ctx.beginPath(); ctx.arc(520 - pan, 70, 34, 0, 7); ctx.fill();
  ctx.fillStyle = '#7cbf6a'; ctx.fillRect(0, 250, 640, 110);
  ctx.fillStyle = '#e3d2a8'; ctx.beginPath(); ctx.moveTo(280, 360); ctx.lineTo(300, 250); ctx.lineTo(340, 250); ctx.lineTo(360, 360); ctx.fill();
  // bangunan kampus (fiksyen)
  ctx.fillStyle = '#f1ead8'; ctx.fillRect(130 - pan * 0.3, 120, 380, 130);
  ctx.fillStyle = '#2c4a7a'; ctx.beginPath(); ctx.moveTo(110 - pan * 0.3, 122); ctx.lineTo(320 - pan * 0.3, 62); ctx.lineTo(530 - pan * 0.3, 122); ctx.fill();
  ctx.fillStyle = '#e2d7bd'; for (let k = 0; k < 9; k++) ctx.fillRect(150 + k * 42 - pan * 0.3, 132, 10, 118);
  ctx.fillStyle = '#5b3a22'; ctx.fillRect(300 - pan * 0.3, 196, 40, 54);
  ctx.fillStyle = '#2a1b10'; ctx.fillRect(250 - pan * 0.3, 98, 140, 18); ctx.fillStyle = '#f2c14e'; ctx.font = '700 12px "Pixelify Sans"'; ctx.textAlign = 'center'; ctx.fillText('KAMPUS UPSI (FIKSYEN)', 320 - pan * 0.3, 111);
  for (const [x, y] of [[60, 250], [100, 262], [560, 250], [600, 266]]) { ctx.fillStyle = '#6a4a2e'; ctx.fillRect(x - 4, y - 30, 8, 30); ctx.fillStyle = '#3f9a4c'; ctx.beginPath(); ctx.arc(x, y - 40, 22, 0, 7); ctx.fill(); }
  // cahaya keemasan & zarah
  for (let k = 0; k < 24; k++) { const x = (hash(k, 3, 9) * 640 + t * 10) % 640, y = (hash(k, 4, 9) * 300 - t * 14 * (1 + k % 3) + 3000) % 300; ctx.fillStyle = `rgba(255,230,140,${0.5 + 0.4 * Math.sin(t * 2 + k)})`; ctx.fillRect(x, y, 3, 3); }
  ctx.restore();
  // watak dewasa

  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-320, -180);
  const walk = Math.max(0, 1 - t / 3), y0 = 330 - walk * 40;
  drawHero(ctx, 'amir', 296, y0, walk > 0 ? 'up' : 'down', walk > 0, t * 8, { h: 150 });
  drawHero(ctx, 'aisyah', 350, y0 + 4, walk > 0 ? 'up' : 'down', walk > 0, t * 8 + 1, { h: 146, phase: 0.5 });
  ctx.restore();
}

// ---------- Panel: Bank, Kedai, Beg ----------
function openBank() {
  const draw = () => {
    const pct = Math.min(100, S.savings / CONFIG.upsiCost * 100);
    const m = openModal(panel('🏦 Bank Impian', `<div class="panel-body">
      <div class="grid2"><div class="card"><h3>Dompet</h3><div class="stat">${S.wallet}</div><div class="muted" style="font-size:12px">Untuk berbelanja di Kedai Token</div></div>
      <div class="card"><h3>Tabung Universiti</h3><div class="stat">${S.savings} / ${CONFIG.upsiCost}</div><div class="bar" style="margin-top:6px"><i style="width:${pct}%"></i></div></div></div>
      <div class="card" style="margin-top:10px"><div class="row"><label for="bamt">Jumlah:</label><input type="number" id="bamt" min="1" step="1" style="width:120px" value="${Math.min(50, Math.max(1, S.wallet))}">
        <button data-q="10">10</button><button data-q="50">50</button><button data-q="100">100</button></div>
        <div class="row" style="margin-top:10px"><button class="primary" id="bdep">Simpan ke Tabung ▸</button><button id="bwd">◂ Keluarkan ke Dompet</button><button id="bdepall">Simpan Semua</button></div>
        <p id="bmsg" class="muted" style="font-size:13px;margin:8px 0 0">Deposit dan pengeluaran adalah manual. Kedai hanya menerima token dompet.</p></div></div>`));
    const amt = () => Math.floor(Number(m.querySelector('#bamt').value));
    const msg = t => (m.querySelector('#bmsg').textContent = t);
    m.querySelectorAll('[data-q]').forEach(b => (b.onclick = () => (m.querySelector('#bamt').value = b.dataset.q)));
    const dep = v => {
      if (!(v > 0)) return msg('Masukkan jumlah integer lebih daripada 0.');
      if (v > S.wallet) return msg('Token dompet tidak mencukupi untuk simpanan itu.');
      S.wallet -= v; S.savings += v; S.maxSavings = Math.max(S.maxSavings, S.savings); ledger('deposit', v, Date.now());
      if (S.savings >= 500) award('penyimpan');
      sfx('coin'); save(); draw(); toast(`Disimpan ${v} token`);
      if (S.savings >= CONFIG.upsiCost && !S.registered) toast('🎓 Tabung cukup untuk UPSI!');
    };
    m.querySelector('#bdep').onclick = () => dep(amt());
    m.querySelector('#bdepall').onclick = () => S.wallet > 0 ? dep(S.wallet) : msg('Dompet kosong.');
    m.querySelector('#bwd').onclick = () => {
      const v = amt();
      if (!(v > 0)) return msg('Masukkan jumlah integer lebih daripada 0.');
      if (v > S.savings) return msg('Baki tabung tidak mencukupi.');
      S.savings -= v; S.wallet += v; ledger('withdraw', v, Date.now()); sfx('coin'); save(); draw(); toast(`Dikeluarkan ${v} token`);
    };
    hudUpdate();
  };
  draw();
}
function openShop() {
  const draw = note => {
    const items = SHOP.map(i => {
      const owned = S.inv[i.id] || 0, cos = i.cat !== 'Power-up' && owned > 0;
      return `<div class="card"><div class="row"><span style="font-size:28px">${i.icon}</span><div style="flex:1"><h3>${i.name}</h3><span class="pill">${i.cat}</span> <span class="muted" style="font-size:12px">dimiliki: ${owned}</span></div></div>
        <p class="muted" style="font-size:13px;margin:6px 0">${i.desc}</p><button ${cos ? 'disabled' : ''} data-buy="${i.id}">${cos ? 'Sudah dimiliki' : `Beli · ${i.price} token`}</button></div>`;
    }).join('');
    const m = openModal(panel('🛒 Kedai Token Izhan', `<div class="panel-body"><p>Dompet: <b class="coin"><i></i>${S.wallet}</b> <span class="muted" style="font-size:13px">· Hanya token dompet diterima.</span></p>${note ? `<div class="feedback bad">${note}</div>` : ''}<div class="grid2" style="margin-top:8px">${items}</div></div>`));
    m.querySelectorAll('[data-buy]').forEach(b => (b.onclick = () => {
      const it = SHOP_BY_ID[b.dataset.buy];
      if (S.wallet < it.price) return draw('Token dompet tidak mencukupi. Pergi ke Bank Impian untuk pengeluaran.');
      S.wallet -= it.price; S.inv[it.id] = (S.inv[it.id] || 0) + 1; ledger('purchase', -it.price, it.id + ':' + Date.now());
      sfx('coin'); save(); hudUpdate(); toast(`Dibeli: ${it.name}`); draw();
    }));
  };
  draw();
}
function openBag() {
  const ids = Object.keys(S.inv).filter(k => S.inv[k] > 0);
  const draw = sel => {
    const slots = ids.map(id => { const it = SHOP_BY_ID[id]; return `<div class="slot ${sel === id ? 'on' : ''}" data-s="${id}" title="${it.name}">${it.icon}<b>${S.inv[id]}</b></div>`; }).join('');
    const it = sel && SHOP_BY_ID[sel];
    const det = it ? `<div class="card" style="margin-top:10px"><h3>${it.icon} ${it.name}</h3><p class="muted" style="margin:4px 0">${it.desc}</p>${it.hat ? `<button class="primary" id="eq">${S.equip.hat === it.id ? 'Tanggalkan' : 'Pakai'}</button>` : it.cat === 'Power-up' ? '<span class="muted" style="font-size:13px">Digunakan melalui butang pantas semasa pertarungan bos.</span>' : ''}</div>` : '';
    const m = openModal(panel('🎒 Beg', `<div class="panel-body">${ids.length ? `<div class="bag">${slots}</div>` : '<p class="muted">Beg masih kosong. Beli barang di Kedai Token Izhan.</p>'}${det}<p class="muted" style="font-size:12px;margin-top:10px">Buku Misteri ada pada butang Buku (B); lencana dipamerkan dalam Profil.</p></div>`));
    m.querySelectorAll('[data-s]').forEach(s => (s.onclick = () => draw(s.dataset.s)));
    const eq = m.querySelector('#eq'); if (eq) eq.onclick = () => { S.equip.hat = S.equip.hat === sel ? null : sel; save(); draw(sel); };
  };
  draw(ids[0]);
}

// ---------- Panel: Buku, Jurnal, Profil, Menu ----------
function openBook(tab = 'nota') {
  const tabs = [['nota', 'Nota Kata Nafi'], ['jurnal', 'Jurnal Misi'], ['halaman', `Halaman Misteri (${pagesRestored()}/5)`], ['capai', 'Pencapaian']];
  let body = '';
  if (tab === 'nota') body = NOTES.map(n => `<div class="card" style="margin-bottom:10px"><h3>${n.t}</h3><p style="margin:4px 0 8px">${n.b}</p>${n.ex.map(([s, w]) => `<div class="ex card" style="margin-top:6px;background:#15163a">${s}<div class="why">→ ${w}</div><span class="muted" style="font-size:11px">ketik untuk penerangan</span></div>`).join('')}</div>`).join('');
  if (tab === 'jurnal') body = journalHtml();
  if (tab === 'halaman') body = `<div class="grid2">${[1, 2, 3, 4, 5].map(n => { const on = S.bosses[n] && S.bosses[n].won; return `<div class="page-slot ${on ? 'on' : ''}">${on ? '📜 ' + BOSSES[n].page : `Halaman ${n} rosak<br><small>${BOSSES[n].name}</small>`}</div>`; }).join('')}</div>${pagesRestored() === 5 ? '<p style="text-align:center;color:var(--gold);font-family:var(--pix)">✨ Buku Tatabahasa Misteri pulih sepenuhnya! ✨</p>' : ''}`;
  if (tab === 'capai') body = `<div class="grid2"><div class="card"><h3>Misi utama</h3><div class="stat">${mainDone()}/25</div></div><div class="card"><h3>Bos ditewaskan</h3><div class="stat">${pagesRestored()}/5</div></div><div class="card"><h3>Latihan sampingan</h3><div class="stat">${S.sideRuns}</div></div><div class="card"><h3>Lencana</h3><div class="stat">${Object.keys(S.badges).length}/${BADGES.length}</div><span class="muted" style="font-size:12px">Lencana sebenar dipamerkan dalam Profil.</span></div></div>`;
  const m = openModal(`<div class="panel"><div class="panel-head"><h2>📖 Buku Tatabahasa Misteri</h2><button class="ghost" data-close>✕</button></div><div class="tabs">${tabs.map(([k, l]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${l}</button>`).join('')}</div><div class="panel-body">${body}</div></div>`);
  m.querySelectorAll('[data-t]').forEach(b => (b.onclick = () => openBook(b.dataset.t)));
  m.querySelectorAll('.ex').forEach(e => (e.onclick = () => e.classList.toggle('open')));
  bindTrack(m, () => openBook('jurnal'));
}
function journalHtml() {
  return [1, 2, 3, 4, 5].map(n => {
    const won = S.bosses[n] && S.bosses[n].won, unl = stageUnlocked(n);
    return `<div class="card" style="margin-bottom:10px"><h3>Tahap ${n} · ${AREAS[STAGE_AREA[n]].name} ${unl ? '' : '🔒'}</h3>
      ${stageQuests(n).map(q => { const st = questStatus(q.id); return `<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:5px 0"><span>${q.name} <span class="muted" style="font-size:12px">· ${q.place}</span></span><span class="row"><span class="pill st-${st}">${ST_LABEL[st]}</span>${['tersedia', 'dalam_proses'].includes(st) && S.magic ? `<button data-track="${q.id}" style="padding:3px 8px;font-size:12px">${S.tracked === q.id ? '◉ Dijejak' : 'Jejak'}</button>` : ''}</span></div>`; }).join('')}
      <div class="row" style="justify-content:space-between;padding-top:6px"><span>👾 Bos: ${BOSSES[n].name}</span><span class="pill st-${won ? 'selesai' : unl && stageDone(n) ? 'tersedia' : 'dikunci'}">${won ? 'Ditewaskan' : unl && stageDone(n) ? 'Dibuka' : 'Dikunci'}</span></div></div>`;
  }).join('');
}
function bindTrack(m, redraw) { m.querySelectorAll('[data-track]').forEach(b => (b.onclick = () => { S.tracked = S.tracked === b.dataset.track ? null : b.dataset.track; save(); hudUpdate(); redraw(); })); }
function openJournal() {
  const m = openModal(panel('📋 Misi', `<div class="panel-body"><p class="muted" style="font-size:13px;margin-top:0">Lima misi setiap tahap boleh dibuat dalam sebarang urutan. Pilih satu misi untuk dijejak oleh kompas.</p>${journalHtml()}</div>`));
  bindTrack(m, openJournal);
}
function openProfile() {
  const pct = S.subs.t ? (S.subs.c / S.subs.t * 100).toFixed(2).replace(/\.00$/, '') + '%' : 'Belum dinilai';
  const badges = BADGES.map(b => `<div class="card badge ${S.badges[b.id] ? '' : 'locked'}" title="${b.how}" data-b="${b.id}"><div class="ic">${b.icon}</div><div style="font-family:var(--pix);font-size:13px">${S.badges[b.id] ? b.name : '???'}</div><div class="muted" style="font-size:11px">${S.badges[b.id] ? 'Diperoleh' : b.how}</div></div>`).join('');
  const m = openModal(panel('👤 Profil Pemain', `<div class="panel-body">
    <div class="row"><img src="${PORTRAITS.amir}" style="width:72px;height:72px;border-radius:12px;border:2px solid var(--gold2)" alt=""><div><h3 style="color:var(--gold);font-size:20px">${esc(S.name || 'Pemain')}</h3><div class="muted">Watak: Amir · Tingkatan 2 · Tahap semasa ${currentStage()}</div><div>${S.registered ? '🎓 Status cerita: <b>Impian tercapai (simulasi)</b>' : 'Status cerita: dalam pengembaraan'}</div></div></div>
    <div class="grid2" style="margin-top:10px">
      <div class="card"><h3>Misi utama</h3><div class="stat">${mainDone()}/25</div></div>
      <div class="card"><h3>Bos</h3><div class="stat">${pagesRestored()}/5</div></div>
      <div class="card"><h3>Dompet</h3><div class="stat">${S.wallet}</div></div>
      <div class="card"><h3>Tabung Universiti</h3><div class="stat">${S.savings}/${CONFIG.upsiCost}</div></div>
      <div class="card"><h3>Peratus penguasaan</h3><div class="stat">${pct}</div><div class="muted" style="font-size:11px">${S.subs.c} betul ÷ ${S.subs.t} jawapan dihantar × 100. Ketepatan latihan terkumpul, bukan Tahap Penguasaan PBD.</div></div>
    </div>
    <h3 style="color:var(--gold);margin:14px 0 8px">Lencana</h3><div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">${badges}</div>
    ${S.registered ? '<div style="margin-top:12px"><button id="replay">🎬 Tonton semula cutscene UPSI</button></div>' : ''}</div>`));
  const r = m.querySelector('#replay'); if (r) r.onclick = () => { closeModal(); playEnding(true); };
  m.querySelectorAll('[data-b]').forEach(e => (e.onclick = () => toast(BADGES.find(b => b.id === e.dataset.b).how)));
}
function openMenu() {
  const st = S.settings;
  const m = openModal(panel('⚙️ Menu', `<div class="panel-body"><div class="grid2">
    <div class="card"><h3>Audio</h3><label>Muzik <input type="range" id="sMus" min="0" max="1" step="0.05" value="${st.music}"></label><br><label>Kesan bunyi <input type="range" id="sFx" min="0" max="1" step="0.05" value="${st.sfx}"></label><br><label><input type="checkbox" id="sMute" ${st.mute ? 'checked' : ''}> Senyap (mute)</label></div>
    <div class="card"><h3>Aksesibiliti</h3><label><input type="checkbox" id="sRed" ${st.reduce ? 'checked' : ''}> Kurangkan gerakan</label><p class="muted" style="font-size:12px">Kawalan: WASD/anak panah gerak · E interaksi · B buku · M peta · J misi · P profil · I beg · Esc menu.</p></div>
    <div class="card"><h3>Simpanan</h3><p class="muted" style="font-size:12px;margin:0 0 8px">Kemajuan disimpan secara automatik pada peranti ini.</p><button id="sSave">Simpan Sekarang</button> <button class="danger" id="sWipe">Padam Kemajuan</button></div>
    </div><p class="disclaimer">TAK BSN ialah permainan pendidikan. Pendaftaran UPSI, token dan yuran dalam permainan ialah simulasi sahaja — bukan tawaran, bayaran atau proses rasmi Universiti Pendidikan Sultan Idris. Soalan contoh perlu disemak oleh guru Bahasa Melayu.</p></div>`,
    `<button id="sTitle">Skrin Utama</button><button class="primary" data-close>Sambung Bermain</button>`));
  const upd = () => { st.music = +m.querySelector('#sMus').value; st.sfx = +m.querySelector('#sFx').value; st.mute = m.querySelector('#sMute').checked; st.reduce = m.querySelector('#sRed').checked; document.body.classList.toggle('reduce', st.reduce); audioApply(); save(); };
  m.querySelectorAll('input').forEach(i => (i.oninput = upd));
  m.querySelector('#sSave').onclick = () => { save(); toast('Disimpan'); };
  m.querySelector('#sWipe').onclick = async () => { if (await confirmBox('Padam kemajuan?', 'Semua kemajuan, token dan lencana pada peranti ini akan dipadam. Tindakan ini tidak boleh dibatalkan.', 'Padam', 'Batal')) { wipeSave(); location.reload(); } };
  m.querySelector('#sTitle').onclick = () => { save(); closeModal(); showTitle(); };
}
const OPENERS = { journal: openJournal, book: () => openBook(), map: openMap, profile: openProfile, bag: openBag, menu: openMenu };
$$('[data-open]').forEach(b => (b.onclick = () => { if (UI.mode === 'play') { sfx('click'); OPENERS[b.dataset.open](); } }));

// ---------- Prolog ----------
async function discoverBook() {
  await talk([['aisyah', 'Ini Perpustakaan Lama. Rak ini penuh buku lama… eh, ada satu buku yang bercahaya!'], ['amir', '“Buku Tatabahasa Misteri”? Kenapa halamannya koyak?']]);
  sfx('magic'); flash('#fff2b0', 500);
  await talk([
    [{ name: 'Buku Misteri' }, '✨ Lima halaman telah terlepas dan menjadi <b>Raksasa Tatabahasa</b>. Pulihkan aku, dan dunia yang bercelaru akan kembali tenang…'],
    ['amir', 'Tengok, Aisyah! Papan tanda kampung tiba-tiba jadi pelik!'],
    ['aisyah', 'Kata nafi “tidak” dan “bukan” bercelaru di mana-mana! Kalau kita bantu penduduk, halaman buku akan pulih — dan kamu dapat token untuk <b>Tabung Universiti</b>.'],
    ['aisyah', 'Cari tanda <b>!</b> pada penduduk dan objek. Tekan <b>B</b> untuk buka Buku Misteri — nota kata nafi ada di dalamnya. Simpan token di <b>Bank Impian</b> untuk impian ke UPSI!'],
  ]);
  S.magic = true; S.prologue = 2; save(); hudUpdate();
  toast('📖 Buku Tatabahasa Misteri diperoleh! (B)');
}
async function startPrologue() {
  setMode('screen');
  const sc = $('#screen'); sc.className = ''; sc.style.backgroundImage = 'url(assets/bg/stage1.jpg)'; sc.innerHTML = '<div class="cine-text">Prolog — Impian Seorang Pelajar</div>';
  sc.classList.remove('hidden'); playMusic('hub');
  await new Promise(r => setTimeout(r, S.settings.reduce ? 300 : 1600));
  setMode('play'); UI.mode = 'title';
  await talk([
    [{ name: '' }, '<i>Rumah Amir, awal pagi. Amir, murid Tingkatan 2, merenung gambar sebuah kampus universiti.</i>'],
    ['amir', 'Aku mahu belajar sampai ke universiti, tetapi kata nafi pun aku masih keliru.'],
    ['aisyah', 'Kita boleh belajar bersama-sama. Jom cari bahan di Perpustakaan Lama!'],
  ]);
  sc.className = 'hidden';
  enterArea('hub'); setMode('play'); S.prologue = 1; save();
  await say('aisyah', `${isTouch ? 'Gerakkan joystick untuk berjalan dan tekan <b>AKSI</b>' : 'Gunakan <b>WASD</b> atau anak panah untuk berjalan, dan tekan <b>E</b>'} untuk bercakap. Ikut kompas di atas skrin ke Perpustakaan Lama!`);
}

// ---------- Skrin utama ----------
function showTitle() {
  setMode('title'); UI.scene = null;
  $('#hud').classList.add('hidden'); $('#compass').classList.add('hidden');
  const sc = $('#screen'); sc.className = ''; sc.style.backgroundImage = 'url(assets/bg/stage5.jpg)';
  const can = hasSave();
  sc.innerHTML = `<div><div class="title-logo">TAK BSN</div><div class="title-sub">Misi Kata Nafi</div>
    <div class="title-btns">${can ? '<button class="primary" id="tCont">Teruskan Pengembaraan</button>' : ''}<button class="${can ? '' : 'primary'}" id="tNew">Mula Baharu</button></div>
    <p class="disclaimer">RPG pendidikan Bahasa Melayu Tingkatan 2 — kata nafi <b>tidak</b> dan <b>bukan</b>. Kemajuan disimpan pada peranti ini. Pendaftaran UPSI dalam permainan ialah simulasi sahaja.</p></div>`;
  sc.classList.remove('hidden');
  const begin = () => { audioInit(); $('#hud').classList.remove('hidden'); };
  if (can) sc.querySelector('#tCont').onclick = () => {
    begin(); S = loadSave() || newState(); saveEnabled = true; document.body.classList.toggle('reduce', S.settings.reduce); audioApply();
    sc.className = 'hidden';
    if (!S.prologue) return startPrologue();
    enterArea(S.area || 'hub', S.px ? { px: S.px, py: S.py } : null); setMode('play');
  };
  sc.querySelector('#tNew').onclick = async () => {
    if (can && !(await confirmBox('Mula baharu?', 'Kemajuan sedia ada pada peranti ini akan digantikan.', 'Mula Baharu', 'Batal'))) return;
    begin();
    sc.innerHTML = `<div class="panel" style="width:min(460px,100%)"><div class="panel-head"><h2>Nama Pemain</h2></div><div class="panel-body"><p class="muted" style="margin-top:0">Gunakan nama samaran — tidak perlu nama sebenar. Kamu akan bermain sebagai Amir.</p><input type="text" id="pname" maxlength="20" style="width:100%" placeholder="cth. Pelajar Cekap"></div><div class="panel-foot"><button class="primary" id="pgo">Mula ▸</button></div></div>`;
    const go = () => { const keepSettings = S.settings; S = newState(); S.settings = keepSettings; S.name = sc.querySelector('#pname').value.trim().slice(0, 20) || 'Pemain'; saveEnabled = true; save(); startPrologue(); };
    sc.querySelector('#pgo').onclick = go;
    sc.querySelector('#pname').onkeydown = e => { if (e.key === 'Enter') go(); };
    sc.querySelector('#pname').focus();
  };
}

// ---------- Input ----------
addEventListener('keydown', e => {
  const typing = e.target && (e.target.tagName === 'INPUT');
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (typing && k !== 'Escape') return;
  input.keys[k] = true;
  if (UI.mode === 'play') {
    if (k === 'e' || k === 'Enter' || k === ' ') { e.preventDefault(); act(); }
    const map = { b: 'book', m: 'map', j: 'journal', p: 'profile', i: 'bag', Escape: 'menu' };
    if (map[k]) { e.preventDefault(); OPENERS[map[k]](); }
  } else if (UI.mode === 'dialog') {
    if (k === 'e' || k === 'Enter' || k === ' ') { e.preventDefault(); const f = document.activeElement; (dlgBtns.includes(f) ? f : dlgBtns[0])?.click(); }
  } else if (UI.mode === 'minigame') { if (MG.onKey) MG.onKey(k); if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) e.preventDefault();
  } else if (UI.mode === 'boss') { if (BOSS.onKey) BOSS.onKey(k);
  } else if (UI.mode === 'modal') {
    if (k === 'Escape' || (['b', 'm', 'j', 'p', 'i'].includes(k))) { e.preventDefault(); closeModal(); }
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k) && !typing) e.preventDefault();
});
addEventListener('keyup', e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; input.keys[k] = false; });
addEventListener('blur', () => { input.keys = {}; });
document.addEventListener('visibilitychange', () => { if (document.hidden) { save(); if (AUD.ctx) AUD.ctx.suspend(); } else if (AUD.ctx) AUD.ctx.resume(); });

(function joystick() {
  const joy = $('#joy'), knob = $('#joyKnob'); let id = null;
  const setK = (dx, dy) => { knob.style.transform = `translate(${dx}px,${dy}px)`; };
  joy.addEventListener('pointerdown', e => { id = e.pointerId; joy.setPointerCapture(id); move(e); });
  const move = e => {
    if (e.pointerId !== id) return;
    const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy), max = 42;
    if (d > max) { dx = dx / d * max; dy = dy / d * max; }
    setK(dx, dy); input.joy = { x: dx / max, y: dy / max, on: true };
  };
  joy.addEventListener('pointermove', move);
  const end = e => { if (e.pointerId !== id) return; id = null; setK(0, 0); input.joy = { x: 0, y: 0, on: false }; };
  joy.addEventListener('pointerup', end); joy.addEventListener('pointercancel', end);
  $('#actBtn').addEventListener('click', () => act());
})();

// ---------- Gelung utama ----------
let last = performance.now(), saveT = 0;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (UI.scene === 'ending') drawEnding(dt);
  else { updateWorld(dt); render(); }
  compassUpdate();
  saveT += dt; if (saveT > 5 && UI.mode === 'play') { saveT = 0; save(); }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
preloadAll();
showTitle();
