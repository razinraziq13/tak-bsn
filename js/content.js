// TAK BSN — kandungan permainan: tetapan ekonomi, watak, misi, bos dan peta.
// Nilai bertanda CADANGAN dalam GDD dikumpulkan di CONFIG supaya mudah dilaras.
'use strict';

const CONFIG = {
  questReward: { 1: 10, 2: 20, 3: 30, 4: 40, 5: 50 },
  bossReward: { 1: 50, 2: 75, 3: 100, 4: 125, 5: 150 },
  sideReward: { easy: 10, med: 20, hard: 30 },
  upsiCost: 1500,
  bossLives: 3,
  stage2Timer: 40, // saat setiap soalan (CADANGAN 30–45 s)
  focusMax: 3,     // kena serangan bos 3 kali = -1 nyawa
};

const PORTRAITS = {
  amir: 'assets/portrait/amir.png', aisyah: 'assets/portrait/aisyah.png', nazhif: 'assets/portrait/nazhif.png',
  razin: 'assets/portrait/razin.png', izhan: 'assets/portrait/izhan.png', kelvin: 'assets/portrait/kelvin.png', hazim: 'assets/portrait/hazim.png',
};
const NAMES = {
  amir: 'Amir', aisyah: 'Aisyah', nazhif: 'Encik Nazhif', razin: 'Razin', izhan: 'Izhan',
  kelvin: 'Kelvin', hazim: 'Hazim', pegawai: 'Pegawai Pendaftaran', buku: 'Buku Misteri',
};

// Sprite dipotong daripada helaian watak asal (assets/sprite). h = tinggi lukisan dalam dunia.
const SPRITES = {
  amir: { idle: ['amir_idle1', 'amir_idle2'], walk: ['amir_walk1', 'amir_walk2', 'amir_walk3', 'amir_walk4'], back: 'amir_back', h: 80 },
  aisyah: { idle: ['aisyah_idle1', 'aisyah_idle2'], walk: ['aisyah_walk1', 'aisyah_walk2', 'aisyah_walk3', 'aisyah_walk4'], back: 'aisyah_back', h: 80 },
  razin: { idle: ['razin'], h: 78 }, izhan: { idle: ['izhan'], h: 78 }, kelvin: { idle: ['kelvin'], h: 78 },
  hazim: { idle: ['hazim'], h: 78 }, nazhif: { idle: ['nazhif'], h: 92 },
};
// Watak tanpa helaian sprite (dilukis prosedural)
const STYLES = {
  pegawai: { skin: '#e9bf96', hair: '#6d6a72', head: 'short', shirt: '#2d3a5a', tie: '#c9a43a', legs: '#2a2f40', tall: true },
};

// ---------- MISI UTAMA (25) — setiap misi ada mini-game sendiri ----------
// Mod: tangkap, gelembung, larian, sorong (pilihan sahaja), kutip, ketuk
const QUESTS = [
  { id: 'S1-M1', stage: 1, name: 'Papan Tanda Pelik', giver: 'papan1', place: 'Jalan Kampung', mode: 'sorong',
    offer: 'Tulisan pada papan tanda ini bercelaru! Sorong setiap ayat ke tong kata nafi yang betul sebelum ia jatuh.' },
  { id: 'S1-M2', stage: 1, name: 'Pesanan Razin', giver: 'razin', place: 'Kedai Buku', mode: 'tangkap',
    offer: 'Amir! Label pesanan buku pelanggan berterbangan dari rak. Tangkap kata nafi yang betul untuk setiap pesanan!' },
  { id: 'S1-M3', stage: 1, name: 'Stok Kios Izhan', giver: 'izhan', place: 'Kedai Token', mode: 'gelembung',
    offer: 'Gelembung sabun dari kios saya membawa kata yang bercampur! Pecahkan gelembung yang betul untuk membetulkan senarai stok.' },
  { id: 'S1-M4', stage: 1, name: 'Jejak Taman Hazim', giver: 'hazim', place: 'Kebun Hazim', mode: 'larian',
    offer: 'Papan arah di laluan taman terganggu. Berlari dan lalu pintu kata yang betul — elak batu di jalan!' },
  { id: 'S1-M5', stage: 1, name: 'Rak Perpustakaan Lama', giver: 'rak1', place: 'Perpustakaan Lama', mode: 'ketuk',
    offer: 'Catatan kata nafi menyorok di celah buku dan muncul sekejap-sekejap. Ketuk catatan yang betul!' },
  { id: 'S2-M1', stage: 2, name: 'Nota Encik Nazhif', giver: 'nazhif', place: 'Dataran Sekolah', mode: 'gelembung',
    offer: 'Nota kelas Tingkatan 2 saya bertukar menjadi gelembung yang terapung. Amir, pecahkan kata nafi yang tepat.' },
  { id: 'S2-M2', stage: 2, name: 'Papan Kenyataan Misteri', giver: 'papan2', place: 'Papan Kenyataan', mode: 'sorong',
    offer: 'Kad pengumuman berguguran dari papan kenyataan! Sorong setiap kad ke tong yang betul.' },
  { id: 'S2-M3', stage: 2, name: 'Kod Kelvin', giver: 'kelvin', place: 'Makmal Komputer', mode: 'ketuk',
    offer: 'Program latihan saya rosak — kata nafi muncul di skrin secara rawak. Ketuk yang betul sebelum ia hilang!' },
  { id: 'S2-M4', stage: 2, name: 'Buku Pinjaman', giver: 'rak2', place: 'Sudut Bacaan', mode: 'kutip',
    offer: 'Kad peminjaman bertaburan di laman. Kutip kata yang betul — hati-hati dengan tompok dakwat!' },
  { id: 'S2-M5', stage: 2, name: 'Dialog Rakan Kelas', giver: 'rakan', place: 'Meja Latihan', mode: 'tangkap',
    offer: 'Kad dialog rakan sekelas jatuh dari meja. Tangkap respons yang betul!' },
  { id: 'S3-M1', stage: 3, name: 'Jejak Perkataan', giver: 'cip', place: 'Laluan Runtuhan', mode: 'kutip',
    offer: 'Cip perkataan bertaburan di lantai hutan. Kutip mengikut susunan ayat yang betul!' },
  { id: 'S3-M2', stage: 3, name: 'Jambatan Ayat', giver: 'jambatan', place: 'Jambatan Kayu', mode: 'tangkap',
    offer: 'Papan jambatan berjatuhan — setiap papan satu perkataan. Tangkap mengikut susunan untuk membina ayat!' },
  { id: 'S3-M3', stage: 3, name: 'Cendawan Nafi', giver: 'cendawan', place: 'Kawasan Cendawan', mode: 'gelembung',
    offer: 'Spora cendawan bercahaya terapung membawa perkataan. Pecahkan mengikut susunan ayat!' },
  { id: 'S3-M4', stage: 3, name: 'Pokok Ingatan', giver: 'pokok', place: 'Pokok Purba', mode: 'larian',
    offer: 'Akar Pokok Purba membuka laluan. Lari melalui pintu perkataan mengikut susunan ayat!' },
  { id: 'S3-M5', stage: 3, name: 'Gerbang Sunyi', giver: 'gerbang3', place: 'Gerbang Runtuhan', mode: 'ketuk',
    offer: 'Batu rune gerbang menyala satu demi satu. Ketuk perkataan mengikut susunan untuk membuka lambang gerbang.' },
  { id: 'S4-M1', stage: 4, name: 'Gerbang Kesalahan', giver: 'gerbang4', place: 'Jambatan Barat', mode: 'larian',
    offer: 'Ayat di pintu gerbang tersilap. Lari dan pilih kata nafi pengganti yang betul!' },
  { id: 'S4-M2', stage: 4, name: 'Taman Perintah', giver: 'tamanistana', place: 'Taman Istana', mode: 'sorong',
    offer: 'Pancang arahan taman tercabut! Sorong setiap ayat ke kata nafi pengganti yang betul.' },
  { id: 'S4-M3', stage: 4, name: 'Arkib Berdebu', giver: 'manuskrip', place: 'Jambatan Arkib', mode: 'tangkap',
    offer: 'Manuskrip arkib berterbangan ditiup angin. Tangkap pembetulan yang betul!' },
  { id: 'S4-M4', stage: 4, name: 'Air Pancut Pertentangan', giver: 'airpancut', place: 'Air Pancut', mode: 'gelembung',
    offer: 'Gelembung air pancut membawa kata nafi. Pilih yang tepat mengikut konteks ayat!' },
  { id: 'S4-M5', stage: 4, name: 'Balairung Betul Salah', giver: 'panel', place: 'Panel Batu', mode: 'ketuk',
    offer: 'Panel batu menyala silih berganti. Ketuk pembetulan yang betul!' },
  { id: 'S5-M1', stage: 5, name: 'Lingkaran Nama', giver: 'lingkaran', place: 'Lingkaran Rune', mode: 'tangkap',
    offer: 'Simbol rune jatuh dari langit ungu. Tangkap jawapan yang betul!' },
  { id: 'S5-M2', stage: 5, name: 'Kristal Perbuatan', giver: 'kristal', place: 'Kristal Ungu', mode: 'larian',
    offer: 'Laluan kristal terbuka! Lari melalui pintu jawapan yang betul.' },
  { id: 'S5-M3', stage: 5, name: 'Cermin Sifat', giver: 'cermin', place: 'Cermin Ajaib', mode: 'gelembung',
    offer: 'Cermin ajaib memantulkan gelembung jawapan. Pecahkan yang betul!' },
  { id: 'S5-M4', stage: 5, name: 'Jejak Pertentangan', giver: 'rune', place: 'Bulatan Kanan', mode: 'kutip',
    offer: 'Serpihan rune bertaburan di lantai arena. Kutip jawapan yang betul, elak bayang kekeliruan!' },
  { id: 'S5-M5', stage: 5, name: 'Pentas Penguasaan', giver: 'altar', place: 'Bulatan Buku', mode: 'ketuk',
    offer: 'Lima kunci pengetahuan berkelip di bulatan buku. Ketuk jawapan yang betul!' },
];
const QUEST_BY_ID = Object.fromEntries(QUESTS.map(q => [q.id, q]));
const MODE_NAMES = { tangkap: 'Tangkap Kata', gelembung: 'Pecah Gelembung', larian: 'Larian Kata', sorong: 'Sorong Kad', kutip: 'Kutip Cip', ketuk: 'Ketuk Pantas' };

const BOSSES = {
  1: { name: 'Kekeliruan Nafi', alias: 'Si Keliru', page: 'Halaman Asas Kata Nafi', mode: 'Hujan Pilihan & Kabut Kekeliruan', gate: 'boss1', music: 'boss1', color: '#9a7cff',
       intro: 'Makhluk huruf yang keliru muncul — "tidak? bukan?" bergema di seluruh kampung!' },
  2: { name: 'Buku Tidak Gramatis', alias: 'Buku Bercelaru', page: 'Halaman Penggunaan Kata Nafi', mode: 'Halaman Salahlaku (bermasa)', gate: 'boss2', timed: true, music: 'boss2', color: '#ff5a6a',
       intro: 'Sebuah buku hidup melompat keluar, halamannya penuh pangkah merah!' },
  3: { name: 'Pengacau Susunan Ayat', alias: 'Penjaga Ayat', page: 'Halaman Pembinaan Ayat', mode: 'Ribut Perkataan & Tukar Susun', gate: 'boss3', music: 'boss3', color: '#c58cff',
       intro: 'Pusaran kertas berpintal — perkataan berterbangan tidak tentu arah!' },
  4: { name: 'Benteng Kesalahan Nafi', alias: 'Kesatria Kesalahan', page: 'Halaman Pembetulan Kesalahan', mode: 'Serangan Ganda & Tembok Tatabahasa', gate: 'boss4', music: 'boss4', color: '#ffd166',
       intro: 'Kesatria berperisai "tidak/bukan" menghalang pintu balairung!' },
  5: { name: 'Penjaga Buku Tatabahasa', alias: 'Maharaja Kekeliruan', page: 'Halaman Penguasaan Kata Nafi', mode: 'Ujian Penguasaan', gate: 'boss5', music: 'boss5', color: '#e070ff',
       intro: 'Halaman terakhir bangkit sebagai tenaga ungu yang besar. Ini cabaran penguasaan!' },
};

const SIDE = {
  easy: { name: 'Latihan Asas Razin', giver: 'razin', reward: CONFIG.sideReward.easy, stages: [1, 2], kinds: ['mcq', 'fill', 'matching'], desc: 'Lima pilihan asas tidak/bukan' },
  med: { name: 'Latihan Konteks Encik Nazhif', giver: 'nazhif', reward: CONFIG.sideReward.med, stages: [2, 3, 5], kinds: ['mcq', 'fill', 'matching', 'correction'], desc: 'Lima ayat konteks' },
  hard: { name: 'Cabaran Kod Kelvin', giver: 'kelvin', reward: CONFIG.sideReward.hard, stages: [3, 4, 5], kinds: ['reorder', 'correction'], desc: 'Lima pembetulan atau susunan' },
};

const SHOP = [
  { id: 'hint', name: 'Petunjuk Tambahan', cat: 'Power-up', price: 15, icon: '💡', desc: 'Bimbingan tambahan semasa bos (bukan jawapan terus).' },
  { id: 'shield', name: 'Perisai Tatabahasa', cat: 'Power-up', price: 30, icon: '🛡️', desc: 'Melindungi satu kehilangan nyawa seterusnya semasa bos.' },
  { id: 'heal', name: 'Pemulihan Nyawa', cat: 'Power-up', price: 40, icon: '❤️', desc: '+1 nyawa semasa bos (maksimum 3).' },
  { id: 'topi_merah', name: 'Topi Merah', cat: 'Kosmetik', price: 60, icon: '🧢', hat: '#c23a3a', desc: 'Topi kosmetik untuk Amir.' },
  { id: 'topi_biru', name: 'Topi Biru', cat: 'Kosmetik', price: 60, icon: '🧢', hat: '#2f62c4', desc: 'Topi kosmetik untuk Amir.' },
  { id: 'topi_emas', name: 'Topi Emas', cat: 'Kosmetik', price: 120, icon: '👑', hat: '#e2b23a', desc: 'Topi kosmetik berkilau untuk Amir.' },
  { id: 'pena_emas', name: 'Pena Bulu Emas', cat: 'Koleksi', price: 80, icon: '🪶', desc: 'Barang koleksi. Tiada kesan pada pembelajaran.' },
  { id: 'kucing', name: 'Anak Kucing Comel', cat: 'Koleksi', price: 150, icon: '🐱', desc: 'Peliharaan koleksi. Tiada kesan pada pembelajaran.' },
];
const SHOP_BY_ID = Object.fromEntries(SHOP.map(i => [i.id, i]));

const BADGES = [
  { id: 'langkah', name: 'Langkah Pertama', icon: '👣', how: 'Selesaikan misi pertama.' },
  { id: 'wira_kampung', name: 'Wira Kampung', icon: '🏡', how: 'Kalahkan bos Tahap 1.' },
  { id: 'bijak', name: 'Bijak Kata Nafi', icon: '🧠', how: 'Hantar 20 jawapan betul.' },
  { id: 'penyimpan', name: 'Penyimpan Bijak', icon: '🏦', how: 'Simpanan Bank Impian mencapai 500 token.' },
  { id: 'penakluk', name: 'Penakluk Bos', icon: '⚔️', how: 'Kalahkan kesemua 5 bos.' },
  { id: 'wira_tatabahasa', name: 'Wira Tatabahasa', icon: '📖', how: 'Pulihkan kelima-lima halaman Buku Misteri.' },
  { id: 'impian', name: 'Impian Tercapai', icon: '🎓', how: 'Daftar ke UPSI (simulasi) dengan 1,500 token.' },
];

const RULE_HINT = {
  frasa_kerja_atau_adjektif: 'Lihat perkataan selepas kata nafi. Perbuatan (kata kerja) atau sifat (kata adjektif)? Gunakan “tidak”.',
  frasa_nama_atau_sendi_nama: 'Lihat perkataan selepas kata nafi. Orang/benda/tempat (kata nama) atau kata sendi seperti “di”, “ke”, “daripada”? Gunakan “bukan”.',
  pertentangan_maklumat: 'Ada “tetapi” dalam ayat? Ayat pertentangan maklumat (bukan … tetapi …) menggunakan “bukan”.',
};
const RULE_LABEL = {
  frasa_kerja_atau_adjektif: 'frasa kerja / frasa adjektif → “tidak”',
  frasa_nama_atau_sendi_nama: 'frasa nama / frasa sendi nama → “bukan”',
  pertentangan_maklumat: 'pertentangan maklumat (bukan … tetapi …) → “bukan”',
};

// ---------- PETA (koordinat = piksel imej peta asal) ----------
// walk: kawasan boleh jalan (rect [x,y,w,h] atau poligon [[x,y],...]); block: halangan (rect / {c:[x,y,r]} / poligon)
const FULL = [[0, 0, 1672, 941]];
const AREAS = {
  hub: {
    name: 'Kampung TAK BSN', stage: 1, img: 'assets/map/hub.jpg', w: 1672, h: 941, music: 'hub', spawn: { x: 465, y: 365 },
    walk: FULL,
    block: [[0, 0, 1672, 40], [0, 0, 215, 700], [0, 700, 160, 241], [150, 836, 420, 105], [215, 0, 475, 92], [230, 40, 375, 262], [230, 300, 180, 45],
      [585, 90, 110, 150], [680, 205, 25, 95], [690, 80, 110, 115], [910, 80, 265, 115], [690, 0, 230, 48], [920, 0, 752, 80], [1120, 45, 385, 287],
      [1010, 215, 110, 120], [1085, 375, 30, 40], [1500, 60, 172, 310], [1235, 420, 355, 140], [1590, 370, 82, 571], [1360, 580, 140, 140], [1500, 620, 100, 90],
      [1105, 580, 280, 255], [1000, 735, 110, 150], [1300, 840, 180, 50], [940, 895, 732, 46], [1045, 690, 30, 30], [745, 490, 170, 110], [665, 495, 70, 55],
      [930, 495, 70, 55], [715, 340, 230, 150], [225, 380, 185, 215], [480, 540, 30, 30], [520, 610, 150, 180], [710, 690, 60, 70], [430, 735, 105, 45],
      [560, 900, 380, 41], [930, 760, 60, 70], [272, 600, 116, 82]],
    labels: [[465, 52, 'Rumah Amir'], [318, 392, 'Kedai Buku Razin'], [1205, 222, 'Kedai Token Izhan'], [1245, 596, 'Perpustakaan Lama'], [860, 30, 'Tangga ke Dunia Lain']],
    points: [
      { id: 'rumah', type: 'obj', look: 'none', x: 465, y: 322, name: 'Pintu Rumah Amir' },
      { id: 'papan1', type: 'obj', look: 'sign', x: 612, y: 350, name: 'Papan Tanda Jalan' },
      { id: 'razin', type: 'npc', x: 452, y: 612, name: 'Razin' },
      { id: 'izhan', type: 'npc', x: 1308, y: 362, name: 'Izhan' },
      { id: 'hazim', type: 'npc', x: 1196, y: 545, name: 'Hazim' },
      { id: 'rak1', type: 'obj', look: 'lectern', x: 1185, y: 872, name: 'Rak Perpustakaan Lama' },
      { id: 'bank', type: 'obj', look: 'bank', x: 330, y: 690, name: 'Bank Impian' },
      { id: 'portal', type: 'obj', look: 'portal', x: 860, y: 168, name: 'Tangga Portal (Peta)' },
      { id: 'boss1', type: 'obj', look: 'rune', x: 830, y: 660, name: 'Bulatan Rune Kampung' },
      { id: 'bas', type: 'obj', look: 'bus', x: 205, y: 772, name: 'Hentian Bas ke UPSI' },
    ],
  },
  school: {
    name: 'Sekolah Misteri', stage: 2, paint: 'school', w: 1672, h: 944, music: 'school', spawn: { x: 836, y: 860 },
    walk: FULL, block: [],
    labels: [[836, 168, 'SEKOLAH MISTERI'], [1300, 600, 'Makmal Komputer'], [300, 600, 'Sudut Bacaan']],
    points: [
      { id: 'portal2', type: 'obj', look: 'portal', x: 836, y: 905, name: 'Pintu Pagar (Peta)' },
      { id: 'nazhif', type: 'npc', x: 700, y: 452, name: 'Encik Nazhif' },
      { id: 'papan2', type: 'obj', look: 'none', x: 628, y: 532, name: 'Papan Kenyataan' },
      { id: 'kelvin', type: 'npc', x: 1262, y: 808, name: 'Kelvin' },
      { id: 'rak2', type: 'obj', look: 'none', x: 300, y: 790, name: 'Rak Sudut Bacaan' },
      { id: 'rakan', type: 'obj', look: 'chat', x: 1016, y: 728, name: 'Meja Latihan Dialog' },
      { id: 'boss2', type: 'obj', look: 'rune', x: 836, y: 440, name: 'Pintu Dewan' },
    ],
  },
  forest: {
    name: 'Hutan Bahasa', stage: 3, img: 'assets/map/forest.jpg', w: 1672, h: 941, music: 'forest', spawn: { x: 150, y: 350 },
    walk: [
      [[40, 300], [230, 310], [390, 322], [470, 298], [560, 298], [610, 330], [700, 335], [800, 375], [900, 395], [1000, 415], [1120, 438], [1180, 420], [1300, 398], [1370, 300], [1380, 240], [1460, 240], [1462, 380], [1420, 470], [1330, 500], [1200, 500], [1080, 520], [960, 560], [905, 620], [890, 690], [760, 690], [720, 620], [660, 560], [580, 500], [520, 440], [480, 405], [390, 412], [230, 412], [120, 392], [40, 372]],
      [[1270, 150], [1520, 140], [1520, 245], [1300, 245]],
      [[742, 680], [885, 680], [895, 941], [752, 941]],
      [[290, 640], [520, 618], [700, 640], [760, 700], [700, 735], [500, 725], [330, 725], [250, 705]], [[110, 700], [340, 690], [420, 760], [330, 805], [150, 805]],
      [[1380, 495], [1452, 495], [1452, 612], [1380, 612]], [[1250, 600], [1560, 600], [1580, 700], [1300, 722], [1240, 680]],
    ],
    block: [{ c: [1205, 440, 18] }, [1010, 380, 115, 70], { c: [545, 640, 16] }, [1430, 625, 75, 55]],
    labels: [], points: [
      { id: 'portal3', type: 'obj', look: 'portal', x: 85, y: 338, name: 'Batu Portal (Peta)' },
      { id: 'cip', type: 'obj', look: 'chips', x: 470, y: 680, name: 'Cip Perkataan' },
      { id: 'jambatan', type: 'obj', look: 'none', x: 420, y: 360, name: 'Jambatan Kayu' },
      { id: 'cendawan', type: 'obj', look: 'none', x: 1420, y: 440, name: 'Cendawan Bercahaya' },
      { id: 'pokok', type: 'obj', look: 'none', x: 860, y: 390, name: 'Pokok Purba' },
      { id: 'gerbang3', type: 'obj', look: 'none', x: 250, y: 760, name: 'Gerbang Runtuhan' },
      { id: 'boss3', type: 'obj', look: 'rune', x: 1410, y: 200, name: 'Bulatan Runtuhan' },
    ],
  },
  castle: {
    name: 'Istana Tatabahasa', stage: 4, img: 'assets/map/castle.jpg', w: 1672, h: 941, music: 'castle', spawn: { x: 836, y: 830 },
    walk: [[225, 300, 1228, 552], [690, 275, 300, 120], [790, 140, 100, 160], [30, 520, 200, 100], [1450, 520, 200, 100], [760, 850, 150, 91]],
    block: [[[420, 340], [580, 340], [615, 380], [615, 500], [580, 535], [420, 535], [390, 500], [390, 380]],
      [[1090, 340], [1255, 340], [1288, 380], [1288, 500], [1255, 535], [1090, 535], [1060, 500], [1060, 380]],
      [385, 645, 230, 205], [1058, 645, 232, 205], { c: [365, 515, 14] }, { c: [650, 515, 14] }, { c: [1020, 515, 14] }, { c: [1305, 515, 14] },
      { c: [355, 735, 14] }, { c: [650, 790, 14] }, { c: [1020, 790, 14] }, { c: [1310, 735, 14] }, [610, 270, 90, 125], [970, 270, 90, 125],
      [225, 230, 120, 150], [1330, 230, 125, 150], [655, 785, 95, 70], [925, 785, 90, 70], [335, 785, 90, 70], [1245, 785, 90, 70]],
    labels: [], points: [
      { id: 'portal4', type: 'obj', look: 'portal', x: 836, y: 905, name: 'Gerbang Selatan (Peta)' },
      { id: 'gerbang4', type: 'obj', look: 'none', x: 130, y: 572, name: 'Gerbang Jambatan Barat' },
      { id: 'tamanistana', type: 'obj', look: 'sign', x: 500, y: 628, name: 'Pancang Taman' },
      { id: 'manuskrip', type: 'obj', look: 'desk', x: 1545, y: 572, name: 'Meja Manuskrip Arkib' },
      { id: 'airpancut', type: 'obj', look: 'none', x: 500, y: 552, name: 'Air Pancut Barat' },
      { id: 'panel', type: 'obj', look: 'panel', x: 1172, y: 556, name: 'Panel Batu' },
      { id: 'boss4', type: 'obj', look: 'rune', x: 840, y: 250, name: 'Pintu Balairung' },
    ],
  },
  arena: {
    name: 'Arena Penguasaan', stage: 5, img: 'assets/map/arena.jpg', w: 1672, h: 941, music: 'arena', spawn: { x: 840, y: 820 },
    walk: [{ e: [840, 470, 515, 255] }, [745, 700, 190, 241], [715, 195, 250, 60]],
    block: [{ c: [415, 625, 22] }, { c: [1262, 625, 22] }],
    labels: [], points: [
      { id: 'portal5', type: 'obj', look: 'portal', x: 840, y: 905, name: 'Tangga Turun (Peta)' },
      { id: 'lingkaran', type: 'obj', look: 'none', x: 468, y: 445, name: 'Lingkaran Rune' },
      { id: 'kristal', type: 'obj', look: 'crystal', x: 1250, y: 380, name: 'Kristal Perbuatan' },
      { id: 'cermin', type: 'obj', look: 'mirror', x: 600, y: 600, name: 'Cermin Ajaib' },
      { id: 'rune', type: 'obj', look: 'none', x: 1085, y: 600, name: 'Batu Rune' },
      { id: 'altar', type: 'obj', look: 'none', x: 840, y: 470, name: 'Bulatan Buku' },
      { id: 'boss5', type: 'obj', look: 'rune', x: 840, y: 255, name: 'Altar Penjaga' },
    ],
  },
  upsi: {
    name: 'Kampus UPSI (fiksyen)', stage: 0, paint: 'campus', w: 1672, h: 944, music: 'upsi', spawn: { x: 836, y: 860 },
    walk: FULL, block: [],
    labels: [[836, 84, 'KAMPUS UPSI — GAMBARAN FIKSYEN'], [560, 395, 'Kaunter Pendaftaran (Simulasi)']],
    points: [
      { id: 'portal6', type: 'obj', look: 'none', x: 405, y: 905, name: 'Bas Pulang (Peta)' },
      { id: 'pegawai', type: 'npc', x: 560, y: 548, name: 'Pegawai Pendaftaran' },
      { id: 'papanupsi', type: 'obj', look: 'sign', x: 720, y: 600, name: 'Papan Maklumat' },
    ],
  },
};
const AREA_ORDER = ['hub', 'school', 'forest', 'castle', 'arena', 'upsi'];
const STAGE_AREA = { 1: 'hub', 2: 'school', 3: 'forest', 4: 'castle', 5: 'arena' };
const PORTAL_IDS = new Set(['portal', 'portal2', 'portal3', 'portal4', 'portal5', 'portal6']);

const NOTES = [
  { t: 'Kata nafi “tidak”', b: 'Digunakan sebelum <b>frasa kerja</b> dan <b>frasa adjektif</b>.',
    ex: [['Amir <u>tidak</u> membaca buku.', '“membaca” ialah kata kerja → tidak'], ['Bilik itu <u>tidak</u> bersih.', '“bersih” ialah kata adjektif → tidak']] },
  { t: 'Kata nafi “bukan”', b: 'Digunakan sebelum <b>frasa nama</b> dan <b>frasa sendi nama</b>.',
    ex: [['Amir <u>bukan</u> seorang guru.', '“seorang guru” ialah frasa nama → bukan'], ['Surat itu <u>bukan</u> daripada sekolah.', '“daripada sekolah” ialah frasa sendi nama → bukan']] },
  { t: 'Pengecualian: pertentangan maklumat', b: '“bukan” boleh hadir sebelum kata kerja atau adjektif jika ayat membawa maksud <b>bukan … tetapi …</b>.',
    ex: [['Dia <u>bukan</u> malas, <u>tetapi</u> letih.', 'ada pertentangan dengan “tetapi” → bukan'], ['Kami <u>bukan</u> bermain, <u>tetapi</u> belajar.', 'ada pertentangan dengan “tetapi” → bukan']] },
];

function hash(x, y, s = 1) { let n = x * 374761393 + y * 668265263 + s * 1442695041; n = (n ^ (n >>> 13)) * 1274126177; return ((n ^ (n >>> 16)) >>> 0) / 4294967295; }
