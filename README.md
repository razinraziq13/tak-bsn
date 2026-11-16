# TAK BSN — Misi Kata Nafi (prototaip boleh dimainkan)

RPG pendidikan 2D top-down untuk Bahasa Melayu Tingkatan 2 (kata nafi *tidak* dan *bukan*), dibina berdasarkan `TAK_BSN_GAME_DESIGN.md` dan `data/TAK_BSN_SOALAN_173.json`.

## Cara main

▶️ **Main terus dalam pelayar:** https://razinraziq13.github.io/tak-bsn/

Buka `index.html` dalam pelayar (Chrome/Edge/Safari). Jika imej atau simpanan tidak berfungsi dari `file://`, jalankan pelayan statik ringkas dalam folder ini, cth. `npx serve .`.

- Komputer: WASD / anak panah gerak · **E** interaksi · **B** Buku Misteri · **M** Peta · **J** Misi · **P** Profil · **I** Beg · **Esc** Menu
- Telefon (landskap): joystick kiri, butang **AKSI** kanan

## Apa yang ada

- **Peta grafik asal anda sebagai dunia boleh diteroka**: Kampung, Hutan Bahasa, Istana Tatabahasa dan Arena Penguasaan menggunakan PNG konsep asal (orang kampung yang dilukis dalam peta telah dipadam dan diganti NPC interaktif). Sekolah Misteri dan Kampus UPSI dilukis dalam gaya pixel-art yang sepadan (tiada peta asal dalam ZIP).
- **Sprite watak daripada helaian asal**: Amir & Aisyah (diam, berjalan 4 bingkai, belakang), Razin, Izhan, Kelvin, Hazim, Encik Nazhif.
- **6 mini-game aksi** — setiap tahap ada 5 jenis berbeza: Tangkap Kata, Pecah Gelembung, Larian Kata, Sorong Kad, Kutip Cip, Ketuk Pantas. Semua menyokong soalan pilihan dan susun perkataan.
- **Bos aksi masa nyata**: elak corak serangan unik setiap bos, sentuh orb jawapan yang betul untuk melancarkan sihir buku. Peraturan GDD dikekalkan (3 nyawa, salah = −1 nyawa & soalan sama, 0 nyawa = ulang set sama, petunjuk Aisyah percuma, maks. 1 power-up berbayar/soalan, Tahap 2 bermasa 40 s). Tambahan: kena serangan 3 kali (Fokus) = −1 nyawa.
- 25 misi, 5 bos, 173 soalan, ekonomi dompet/tabung, kedai, beg, lencana, profil, Buku Misteri, epilog UPSI — seperti sebelum ini.

## Belum dibina (perlukan backend)

Akaun nama pengguna/Google, simpanan awan merentas peranti, Dashboard Guru, kelas, Menu Tugasan dan laporan guru (GDD §12). Semua nilai token/harga ialah CADANGAN dan dikumpul dalam `CONFIG` di `js/content.js`.

## Struktur

```
index.html            HUD, gaya dan susun atur
js/content.js         CONFIG ekonomi, misi, bos, kedai, lencana, peta
js/engine.js          simpanan & audio
js/world.js           peta, perlanggaran, sprite, lukisan dunia
js/painter.js         peta pixel-art Sekolah & Kampus UPSI
js/minigames.js       6 mod mini-game misi
js/boss.js            pertarungan bos aksi
js/ui.js              dialog, panel, prolog & epilog
js/questions.js       dijana daripada data/TAK_BSN_SOALAN_173.json
assets/map, sprite, portrait, boss, bg   dipotong/diproses daripada grafik asal ZIP
```

Untuk menjana semula `js/questions.js` selepas menyunting JSON: lihat baris pertama fail itu (skrip Node ringkas yang memetakan medan JSON).

Soalan ialah contoh kandungan — perlu disemak oleh guru Bahasa Melayu sebelum digunakan untuk pentaksiran. Pendaftaran UPSI dalam permainan ialah simulasi sahaja.

Varian dewasa Amir/Aisyah dan Pegawai Pendaftaran UPSI masih belum ada dalam ZIP — epilog menggunakan sprite Tingkatan 2 buat sementara, dan pegawai dilukis secara prosedural.
