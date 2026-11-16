// TAK BSN — pelukis peta pixel-art untuk kawasan yang tiada grafik peta asal (Sekolah Misteri, Kampus UPSI).
// Dilukis pada resolusi rendah (1/4) kemudian dibesarkan 4x supaya piksel sepadan dengan peta konsep.
'use strict';
const PAINT = (() => {
  const LW = 418, LH = 236;
  let c, g, seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const D = (x, y, col) => R(x, y, 1, 1, col);
  function circle(cx, cy, r, col) { g.fillStyle = col; for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } }
  function ellipse(cx, cy, rx, ry, col) { g.fillStyle = col; for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry))); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } }
  function grass(x0, y0, w, h, base = '#7cc35a') {
    R(x0, y0, w, h, base);
    for (let i = 0; i < w * h / 900; i++) { const cx = x0 + rnd() * w, cy = y0 + rnd() * h; ellipse(Math.round(cx), Math.round(cy), 6 + Math.floor(rnd() * 10), 3 + Math.floor(rnd() * 5), rnd() < 0.5 ? '#74bb53' : '#85ca62'); }
    for (let i = 0; i < w * h * 0.14; i++) { const x = x0 + Math.floor(rnd() * w), y = y0 + Math.floor(rnd() * h); D(x, y, rnd() < 0.5 ? '#68b04a' : '#95d66e'); }
    for (let i = 0; i < w * h * 0.02; i++) { const x = x0 + Math.floor(rnd() * w), y = y0 + Math.floor(rnd() * h); D(x, y, '#4f9a3c'); D(x + 1, y - 1, '#5aa845'); D(x + 2, y, '#4f9a3c'); D(x + 1, y - 2, '#a6e07a'); }
  }
  function flowers(x0, y0, w, h, n) { for (let i = 0; i < n; i++) { const x = x0 + Math.floor(rnd() * w), y = y0 + Math.floor(rnd() * h), col = ['#ff8fb1', '#ffd34e', '#ffffff', '#c59bff', '#ff6b6b'][Math.floor(rnd() * 5)]; D(x, y, col); D(x + 1, y + 1, '#4f9a3c'); } }
  function pavers(x0, y0, w, h, a = '#ddd3c3', b = '#c9bda9') {
    R(x0, y0, w, h, a);
    for (let y = y0; y < y0 + h; y += 5) { R(x0, y, w, 1, b); const off = ((y - y0) / 5) % 2 ? 3 : 0; for (let x = x0 + off; x < x0 + w; x += 7) R(x, y, 1, 5, b); }
    for (let i = 0; i < w * h * 0.03; i++) D(x0 + Math.floor(rnd() * w), y0 + Math.floor(rnd() * h), '#efe7da');
  }
  function tree(cx, cy, r = 13, dark = '#2f7a35', mid = '#45a046', light = '#6cc25a') {
    ellipse(cx + 3, cy + r - 1, r + 2, 4, 'rgba(0,0,0,.28)');
    R(cx - 2, cy + 1, 5, r - 1, '#5a3820'); R(cx - 1, cy + 1, 2, r - 1, '#82552f'); D(cx - 3, cy + r - 1, '#5a3820'); D(cx + 3, cy + r - 1, '#5a3820');
    const blobs = [[0, -2, r], [-r * 0.55, 1, r * 0.68], [r * 0.55, 1, r * 0.68], [-r * 0.25, -r * 0.55, r * 0.7], [r * 0.3, -r * 0.5, r * 0.62]].map(b => b.map(Math.round));
    for (const [x, y, rr2] of blobs) circle(cx + x, cy + y - 3, rr2 + 1, '#173d1c');
    for (const [x, y, rr2] of blobs) circle(cx + x, cy + y - 3, rr2, dark);
    for (const [x, y, rr2] of blobs) circle(cx + x - 1, cy + y - 5, Math.max(1, rr2 - 2), mid);
    for (const [x, y, rr2] of blobs) circle(cx + x - Math.round(rr2 * 0.35), cy + y - 3 - Math.round(rr2 * 0.45), Math.max(1, Math.round(rr2 * 0.38)), light);
    for (let i = 0; i < r * 3; i++) { const a = rnd() * 6.28, dd = rnd() * (r - 2); D(Math.round(cx + Math.cos(a) * dd), Math.round(cy - 4 + Math.sin(a) * dd), rnd() < 0.5 ? dark : '#8fdc72'); }
  }
  function bush(cx, cy, col = '#3f9444') { circle(cx, cy, 5, '#1d4a22'); circle(cx, cy, 4, col); D(cx - 2, cy - 2, '#7fd06a'); D(cx - 1, cy - 3, '#7fd06a'); }
  function bench(x, y) { R(x, y, 14, 2, '#8a5a34'); R(x, y + 3, 14, 2, '#a8723f'); R(x + 1, y + 5, 1, 3, '#4a3020'); R(x + 12, y + 5, 1, 3, '#4a3020'); R(x, y - 1, 14, 1, '#4a3020'); }
  function lamp(x, y) { R(x, y - 16, 2, 16, '#3a3550'); R(x - 2, y - 20, 6, 5, '#3a3550'); R(x - 1, y - 19, 4, 3, '#ffe28a'); circle(x + 1, y - 18, 6, 'rgba(255,226,138,.18)'); }
  function windowPix(x, y, w = 9, h = 11, glass = '#8fd0ff') { R(x - 1, y - 1, w + 2, h + 2, '#3e3560'); R(x, y, w, h, glass); R(x, y, w, 2, '#c8ecff'); R(x + Math.floor(w / 2), y, 1, h, '#3e3560'); R(x, y + Math.floor(h / 2), w, 1, '#3e3560'); R(x - 1, y + h + 1, w + 2, 1, '#e8e0f5'); }
  function roofBand(x, y, w, h, base, line, ridge) { R(x, y, w, h, base); for (let yy = y + 3; yy < y + h; yy += 4) R(x, yy, w, 1, line); R(x, y, w, 2, ridge); R(x - 1, y - 1, w + 2, 1, '#241f38'); R(x - 1, y + h, w + 2, 1, '#241f38'); R(x - 1, y, 1, h, '#241f38'); R(x + w, y, 1, h, '#241f38'); }
  function fence(x0, x1, y) { for (let x = x0; x < x1; x += 6) { R(x, y - 6, 2, 7, '#7a5232'); D(x, y - 7, '#a8723f'); } R(x0, y - 4, x1 - x0, 1, '#a8723f'); R(x0, y - 1, x1 - x0, 1, '#a8723f'); }

  function finish(blocks) {
    const out = document.createElement('canvas'); out.width = LW * 4; out.height = LH * 4;
    const o = out.getContext('2d'); o.imageSmoothingEnabled = false; o.drawImage(c, 0, 0, out.width, out.height);
    return { canvas: out, blocks: blocks.map(b => b.map(v => v * 4)) };
  }
  function start(s) { c = document.createElement('canvas'); c.width = LW; c.height = LH; g = c.getContext('2d'); seed = s; }

  function school() {
    start(7);
    grass(0, 0, LW, LH);
    // laluan & dataran
    pavers(70, 96, 278, 44); pavers(190, 140, 38, 96);
    R(70, 96, 278, 1, '#b3a690'); R(70, 139, 120, 1, '#b3a690'); R(228, 139, 120, 1, '#b3a690');
    // bangunan sekolah (fasad depan, gaya ungu senja seperti grafik pratonton)
    R(84, 96, 252, 3, 'rgba(0,0,0,.18)');
    R(86, 40, 246, 56, '#c7b9e3'); R(86, 40, 246, 3, '#e8e0f5'); R(86, 90, 246, 6, '#8f84ad'); R(85, 40, 1, 56, '#3e3560'); R(332, 40, 1, 56, '#3e3560');
    roofBand(80, 14, 104, 28, '#5b5486', '#4a4472', '#7a73a8'); roofBand(234, 14, 104, 28, '#5b5486', '#4a4472', '#7a73a8');
    for (const row of [48, 70]) for (let x = 94; x < 326; x += 16) if (x < 178 || x > 238) windowPix(x, row);
    // menara tengah
    R(180, 18, 58, 78, '#d6caef'); R(179, 18, 1, 78, '#3e3560'); R(238, 18, 1, 78, '#3e3560');
    g.fillStyle = '#241f38'; g.beginPath(); g.moveTo(174, 20); g.lineTo(209, 0); g.lineTo(244, 20); g.fill();
    g.fillStyle = '#5b5486'; g.beginPath(); g.moveTo(177, 19); g.lineTo(209, 2); g.lineTo(241, 19); g.fill();
    R(185, 16, 48, 3, '#7a73a8');
    circle(209, 28, 8, '#3e3560'); circle(209, 28, 7, '#fff8e6'); R(209, 22, 1, 6, '#2a2440'); R(209, 28, 4, 1, '#2a2440');
    R(190, 39, 38, 7, '#2a1b10'); // papan nama
    windowPix(186, 52, 8, 10); windowPix(224, 52, 8, 10);
    R(196, 68, 26, 28, '#e8e0f5'); R(199, 71, 20, 25, '#6b4226'); R(208, 71, 1, 25, '#4a2c18'); D(206, 84, '#f2c14e'); D(211, 84, '#f2c14e');
    R(193, 68, 3, 28, '#efe9f8'); R(222, 68, 3, 28, '#efe9f8');
    R(192, 96, 34, 2, '#bdb2cc'); R(190, 98, 38, 2, '#cfc6dc');
    // pokok renek depan bangunan
    for (let x = 92; x < 330; x += 11) if (x < 182 || x > 236) bush(x, 99, x % 2 ? '#3f9444' : '#4aa04c');
    flowers(90, 101, 90, 3, 26); flowers(238, 101, 90, 3, 26);
    // tiang bendera
    R(118, 66, 2, 34, '#d9d4e6'); R(120, 67, 12, 4, '#d23a3a'); R(120, 71, 12, 4, '#ffffff'); R(120, 67, 5, 4, '#2f62c4'); D(122, 68, '#f2c14e');
    // papan kenyataan
    R(146, 108, 22, 14, '#6b4a2e'); R(148, 110, 18, 10, '#cfe3c0'); R(149, 111, 5, 4, '#e74c3c'); R(156, 112, 7, 5, '#f1c40f'); R(150, 116, 6, 3, '#fff'); R(148, 122, 2, 5, '#4a3020'); R(164, 122, 2, 5, '#4a3020');
    bench(250, 112); bench(96, 124); lamp(178, 138); lamp(240, 138);
    // Sudut Bacaan (gazebo)
    ellipse(75, 188, 22, 4, 'rgba(0,0,0,.2)');
    R(58, 168, 34, 20, '#e9dcc0'); R(60, 172, 8, 14, '#7a4a2a'); R(61, 173, 2, 4, '#c0392b'); R(63, 173, 2, 4, '#2e86de'); R(65, 173, 2, 4, '#27ae60'); R(61, 179, 2, 4, '#f39c12'); R(63, 179, 2, 4, '#8e44ad');
    R(82, 172, 8, 14, '#7a4a2a'); R(83, 173, 2, 4, '#27ae60'); R(85, 173, 2, 4, '#c0392b'); R(83, 179, 2, 4, '#2e86de'); R(86, 179, 2, 4, '#f1c40f');
    R(57, 166, 2, 22, '#5a3a22'); R(91, 166, 2, 22, '#5a3a22');
    g.fillStyle = '#5a2a20'; g.beginPath(); g.moveTo(50, 168); g.lineTo(75, 152); g.lineTo(100, 168); g.fill();
    g.fillStyle = '#b5482f'; g.beginPath(); g.moveTo(53, 167); g.lineTo(75, 154); g.lineTo(97, 167); g.fill();
    R(60, 162, 30, 1, '#8c3424');
    // Makmal Komputer (bangunan sampingan)
    ellipse(325, 192, 40, 4, 'rgba(0,0,0,.2)');
    R(290, 158, 70, 32, '#ece8f4'); R(290, 186, 70, 4, '#b8b0cc');
    roofBand(286, 142, 78, 17, '#3d5a9a', '#344d85', '#5677bd');
    for (const x of [296, 312, 340]) { windowPix(x, 165, 9, 9, '#5fd0ff'); }
    R(325, 168, 10, 22, '#4a6aa8'); R(327, 170, 6, 20, '#89b4ff');
    R(300, 148, 50, 7, '#2a1b10');
    // meja latihan dialog
    R(244, 158, 20, 8, '#8a5a34'); R(244, 157, 20, 2, '#a8723f'); R(246, 166, 2, 4, '#4a3020'); R(260, 166, 2, 4, '#4a3020'); bench(244, 170); bench(244, 151);
    // pokok sempadan
    for (const [x, y, r] of [[16, 112, 13], [14, 150, 12], [22, 196, 14], [44, 226, 11], [120, 222, 12], [160, 200, 9], [300, 222, 12], [372, 214, 13], [402, 176, 12], [404, 130, 13], [388, 100, 10], [30, 72, 12], [52, 36, 14], [16, 14, 12], [372, 50, 13], [400, 14, 12], [352, 20, 10]]) tree(x, y, r);
    bush(110, 170); bush(130, 182); bush(270, 205); bush(345, 206); flowers(100, 150, 70, 60, 50); flowers(250, 180, 30, 40, 18);
    fence(0, 186, 234); fence(232, LW, 234);
    R(186, 226, 2, 10, '#5a5a6a'); R(230, 226, 2, 10, '#5a5a6a');
    const blocks = [
      [0, 0, LW, 8], [80, 0, 260, 99], [0, 0, 68, 236], [350, 0, 68, 236], [0, 228, 186, 8], [232, 228, 186, 8],
      [116, 68, 6, 32], [144, 106, 26, 20], [54, 160, 42, 28], [286, 140, 78, 50], [242, 150, 24, 26],
      [94, 122, 18, 6], [248, 110, 18, 6], [176, 122, 5, 16], [238, 122, 5, 16], [110, 210, 22, 20], [150, 192, 18, 18], [290, 210, 22, 20],
    ];
    return finish(blocks);
  }

  function campus() {
    start(11);
    grass(0, 0, LW, LH, '#80c862');
    pavers(64, 96, 290, 40, '#e8dcc0', '#d3c4a2'); pavers(190, 136, 38, 100, '#e8dcc0', '#d3c4a2');
    // bangunan utama berlajur (gambaran fiksyen)
    R(70, 34, 278, 62, '#f3ead6'); R(70, 90, 278, 6, '#cbbf9f'); R(69, 34, 1, 62, '#5a4a30'); R(348, 34, 1, 62, '#5a4a30');
    roofBand(64, 14, 290, 22, '#2c4a7a', '#24406b', '#3d62a0');
    for (const row of [44, 66]) for (let x = 80; x < 340; x += 15) if (x < 168 || x > 246) windowPix(x, row, 8, 11, '#9fd7ff');
    R(160, 30, 98, 66, '#fbf5e8');
    g.fillStyle = '#5a4a30'; g.beginPath(); g.moveTo(152, 34); g.lineTo(209, 6); g.lineTo(266, 34); g.fill();
    g.fillStyle = '#f7efdc'; g.beginPath(); g.moveTo(157, 33); g.lineTo(209, 9); g.lineTo(261, 33); g.fill();
    for (let x = 166; x < 256; x += 13) { R(x, 38, 6, 54, '#ffffff'); R(x + 5, 38, 1, 54, '#d8cdb5'); R(x - 1, 36, 8, 3, '#e3d8bf'); }
    R(196, 70, 26, 22, '#6b4226'); R(208, 70, 1, 22, '#4a2c18');
    for (let i = 0; i < 4; i++) R(180 - i * 3, 92 + i * 2, 58 + i * 6, 2, i % 2 ? '#e2d6bc' : '#efe5cf');
    R(180, 18, 58, 8, '#2a1b10');
    for (let x = 76; x < 346; x += 9) if (x < 172 || x > 248) bush(x, 99, '#3f9444');
    // air pancut
    ellipse(209, 118, 20, 9, '#7d7a8c'); ellipse(209, 117, 18, 7, '#5ab0e0'); ellipse(209, 116, 10, 4, '#8fd3ff'); R(207, 104, 4, 12, '#c9c3d6'); circle(209, 104, 4, '#c9c3d6'); D(209, 99, '#bfe9ff'); D(207, 101, '#bfe9ff'); D(211, 101, '#bfe9ff');
    // khemah pendaftaran
    ellipse(140, 128, 24, 4, 'rgba(0,0,0,.2)');
    R(120, 112, 40, 14, '#ffffff'); R(122, 118, 36, 8, '#e9e2d0');
    for (let x = 116; x < 164; x += 8) { R(x, 104, 8, 8, (x / 8) % 2 ? '#2c4a7a' : '#ffffff'); }
    R(116, 112, 48, 2, '#1d3358'); R(118, 112, 2, 16, '#888'); R(158, 112, 2, 16, '#888');
    // pokok & lampu sepanjang jalan
    for (const y of [150, 180, 210]) { tree(172, y, 9); tree(246, y, 9); lamp(184, y + 6); lamp(234, y + 6); }
    for (const [x, y, r] of [[18, 40, 13], [20, 90, 12], [24, 150, 14], [30, 210, 13], [80, 220, 11], [400, 40, 13], [398, 96, 12], [394, 150, 14], [390, 212, 13], [338, 222, 11], [60, 170, 10], [360, 172, 10]]) tree(x, y, r);
    flowers(80, 140, 90, 70, 70); flowers(256, 140, 90, 70, 70);
    // hentian bas
    R(100, 210, 2, 18, '#5a5a6a'); R(94, 204, 14, 7, '#2f62c4'); D(100, 207, '#ffffff');
    const blocks = [[0, 0, LW, 8], [60, 0, 298, 99], [0, 0, 40, 236], [378, 0, 40, 236], [0, 230, LW, 6], [186, 102, 46, 22], [114, 102, 50, 26],
      [162, 140, 20, 12], [236, 140, 20, 12], [162, 170, 20, 12], [236, 170, 20, 12], [162, 200, 20, 12], [236, 200, 20, 12], [50, 160, 20, 20], [350, 162, 20, 20]];
    return finish(blocks);
  }
  return { school, campus };
})();
