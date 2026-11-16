# TAK BSN — GAME DESIGN DOCUMENT (GDD) & SPESIFIKASI PEMBANGUNAN

**Versi:** 1.0 — spesifikasi perbincangan / handoff Claude Code & GitHub  
**Tarikh:** 16 November 2026  
**Bahasa permainan:** Bahasa Melayu  
**Sasaran pembelajaran:** Bahasa Melayu Tingkatan 2 — kata nafi *tidak* dan *bukan*  
**Genre:** RPG pendidikan 2D top-down, pengembaraan realistik + fantasi, mini-game tatabahasa  
**Peranti:** pelayar web komputer dan telefon, landskap  
**Status:** **DOKUMEN PERANCANGAN**, bukan perisian siap dibina

> **Cara menggunakan dokumen:** Baca bersama folder `assets/` dan fail `data/TAK_BSN_SOALAN_173.json` dalam pakej ZIP yang disediakan. Pautan imej di bawah merujuk kepada grafik pengguna sendiri, **bukan** imej baharu. Dokumen ini memisahkan `DISAHKAN` (keputusan pengguna), `SUMBER ASET` (apa yang benar-benar ada dalam ZIP), dan `CADANGAN IMPLEMENTASI` (butiran diisi untuk memudahkan pembangunan, boleh diubah). Apabila bercanggah, **pilihan terakhir pengguna mengatasi cadangan lama dan label dalam grafik lama**.

## 0. Ringkasan satu halaman

**TAK BSN — Misi Kata Nafi** ialah permainan pendidikan RPG yang mengisahkan **Amir**, seorang murid Tingkatan 2 yang bercita-cita melanjutkan pelajaran ke **Universiti Pendidikan Sultan Idris (UPSI)** pada masa hadapan. Amir kurang mahir membezakan kata nafi *tidak* dan *bukan*. Sahabatnya **Aisyah**, juga murid Tingkatan 2, menemaninya ke Perpustakaan Lama. Mereka menemui **Buku Tatabahasa Misteri** yang rosak; lima halaman buku telah berubah menjadi **Raksasa Tatabahasa** dan menyebabkan lima dunia bercelaru. Amir meneroka Kampung TAK BSN, Sekolah Misteri, Hutan Bahasa, Istana Tatabahasa dan Arena Penguasaan; setiap dunia ada **5 misi bebas + 1 bos**. Memulihkan buku mengukuhkan ilmu Amir. Dia memperoleh token yang boleh dibelanjakan di kedai atau disimpan secara manual di **Bank Impian**. Apabila simpanannya sekurang-kurangnya **1,500 token**, pemain boleh memilih bila hendak mendaftar ke UPSI; **1,500 token ditolak** ketika pendaftaran. **Lompatan masa beberapa tahun** memastikan pendaftaran berlaku selepas Amir tamat persekolahan dan layak dalam naratif fiksyen. Sebuah **cutscene sinematik** menutup cerita, tetapi mod pengembaraan/latihan kekal boleh dimainkan.

**Penting:** Pendaftaran, yuran 1,500 token, surat/pegawai dan adegan UPSI ialah **simulasi dalam permainan sahaja**, bukan tawaran kemasukan, bayaran atau proses rasmi UPSI. Tidak ada kutipan wang sebenar.

### Definisi siap (pengalaman pemain)

1. Boleh mendaftar/log masuk dengan nama pengguna + kata laluan atau Google, dan kemajuan disimpan merentas peranti.
2. Boleh bergerak sebagai Amir dengan Aisyah mengikuti secara automatik, mengakses peta, jurnal, profil, kedai, bank dan inventori.
3. Boleh membuka tahap berturutan, memilih 5 misi dalam sebarang urutan, menerima/menolak misi, menjawab 5 soalan setiap misi, dan menewaskan bos dengan 3 nyawa.
4. Lima halaman dipulihkan melalui bos; lencana diperoleh dan dipamerkan dalam profil.
5. Boleh mengulang misi sampingan bagi memperoleh token pada kadar ganjaran sama, menyimpan/mengeluarkan token secara manual, dan memilih pendaftaran UPSI apabila 1,500 token mencukupi.
6. Guru boleh membina kelas, tugasan tambahan interaktif, dan melihat rekod pembelajaran mengikut kebenaran.
7. Selepas cutscene, pemain boleh meneruskan penerokaan serta pembelajaran; kejayaan UPSI tidak ditarik balik.


## 1. Keputusan reka bentuk yang TELAH DISAHKAN

| Bidang | Keputusan terkini pengguna | Catatan wajib |
|---|---|---|
| Sasaran | Semua **watak murid Tingkatan 2**; sasaran pelajar Tingkatan 2 | Helaian aset lama tertulis Tingkatan 5 — **abaikan dan betulkan label sahaja**; reka bentuk Amir/Aisyah asal kekal |
| Wira & pendamping | Amir watak utama, Aisyah mengikuti Amir secara automatik | Pemain mengawal Amir, bukan Aisyah |
| Naratif | Impian universiti; buku rosak; Perpustakaan Lama; gabungan dunia biasa/fantasi | Tiada penjahat sebenar di sebalik buku rosak; bos ialah halaman rosak |
| Buku misteri | Panduan ajaib dengan **butang buku khas** | Bukan buku sebagai portal wajib; menyimpan nota/jurnal/5 halaman |
| Dunia | Kampung TAK BSN sebagai hub + **5 dunia berasingan** | Portal, laluan rahsia dan peta boleh digunakan; tahap berikutnya dikunci oleh bos sebelumnya |
| Struktur | **5 tahap, 25 misi utama (5/tahap), 5 bos** | 5 misi boleh dipilih/dilaksanakan bebas dalam tahap; bos dibuka selepas kelimanya selesai |
| Jenis misi | NPC quests + penerokaan + mini-game | NPC/objek dan buku sama-sama memberi petunjuk |
| Dialog | Potret + gelembung; teks serta-merta | Tiada suara watak; dialog penting potret, dialog ringkas gelembung |
| Kamera & paparan | Top-down semasa teroka; paparan khas untuk mini-game dan bos | Landskap komputer/telefon; moden + comel pixel art |
| Transisi | Pop-up untuk mini-game biasa; sinematik untuk bos | Kamera menumpu pada bos ketika peralihan |
| Audio | Audio dinamik; tiada rakaman suara | Muzik mengikut dunia/situasi, kesan bunyi dan tetapan kelantangan |
| Kawalan | Papan kekunci komputer; joystick + AKSI di telefon | Peta, buku, menu dengan butang skrin |
| Quest | Interaksi NPC **Terima/Tolak**, NPC kekal lokasi | NPC baharu hanya jika perlu; aktiviti sedia ada diutamakan |
| Panduan | Penanda (!), kompas, jurnal | Boleh bergerak ke lokasi objektif |
| Belajar | Tutorial NPC + contoh interaktif + misi + penerangan | Maklum balas pintar ketika jawab dan laporan akhir |
| Soalan misi | **5 setiap misi** | 25 × 5 = **125** soalan utama |
| Soalan bos | **5, 7, 9, 12, 15** mengikut tahap | Jumlah **48**; keseluruhan utama **173** |
| Bos | 5 **Raksasa Tatabahasa**, gaya pertempuran berbeza | Selepas menang, bos berubah menjadi **halaman buku**, bukan jadi rakan NPC |
| Syarat menang bos | Selesaikan semua soalan, sekurang-kurangnya 1 nyawa masih ada | Jawapan salah = -1 nyawa, cuba **soalan sama** lagi |
| Nyawa | 3 permulaan setiap cubaan bos; pulih penuh apabila ulang | Bila 0 nyawa, mula dari soalan 1 dengan **set soalan sama**; misi selesai kekal |
| Aisyah | 1 petunjuk khas percuma / bos / cubaan | Tidak dikira power-up; boleh bersama 1 power-up yang dibeli pada soalan yang sama |
| Power-up | Petunjuk, perisai, pulih nyawa; hanya dibeli di Kedai Token | **Butang pantas** semasa bos; maksimum **1 power-up berbayar bagi setiap soalan** |
| Beg | Beg RPG interaktif, kapasiti tanpa had | Item sama boleh ditindan; buku tetap butang berasingan |
| Ekonomi | Ganjaran misi utama mengikut **kesukaran tahap** | Jumlah cadangan misi utama + bos **1,250** token; nilai perlu diuji keseimbangannya |
| Misi sampingan | Boleh diulang, **ganjaran sama setiap ulang** | Bank soalan berubah disyorkan; beri token setiap selesai |
| Kedai | Kosmetik + power-up + koleksi | **Dompet sahaja** boleh bayar; tiada potongan automatik dari tabung |
| Tabung | Bank Impian, deposit/pengeluaran **manual dan boleh dikeluarkan** | Sasaran **1,500 token**, tidak dipotong sebelum pendaftaran |
| UPSI | Daftar di **kampus**, bila pemain mahu, setelah simpanan cukup | 1,500 token **ditolak** selepas pengesahan; `registered` kekal, cutscene sinematik; boleh terus bermain |
| Masa | **Lompatan masa** sebelum pendaftaran UPSI | Amir tetap Tingkatan 2 semasa pengembaraan; pendaftaran berlangsung beberapa tahun kemudian |
| Lencana | Pelbagai lencana, termasuk **Lencana Wira Tatabahasa** setelah pulih 5 halaman | **Lencana dipamer dalam Profil**, bukan galeri/trofi khusus; **bukan** pakaian eksklusif untuk pemulihan buku |
| Penguasaan | Peratus `betul / semua jawapan dihantar × 100` | **Hanya dipaparkan dalam profil**, bukan HUD/keputusan; guru boleh lihat laporan |
| Akaun | Nama pengguna/kata laluan **atau Google** | Simpan kemajuan awan, akses murid + guru |
| Guru | Dashboard lengkap, pengurusan kelas/analisis/PBD berbantukan bukti | 25 misi tetap; guru boleh cipta latihan tambahan pelbagai format |
| Tugasan guru | Menu Tugasan **dan** NPC guru | MCQ, isi kosong, susun perkataan, padanan, betulkan kesalahan |
| Penamat | Cutscene sinematik, **tanpa montaj imbas kembali** | Tamat cerita tetapi bebas meneroka/berlatih lagi |

**Belum dijawab oleh pengguna:** bilangan **misi aktif serentak** (pilihan terakhir yang ditanya tetapi belum disahkan). `CADANGAN IMPLEMENTASI`: benarkan semua lima diterima serentak kerana misi boleh dipilih bebas; pemain menandakan satu misi sebagai **misi dijejak** untuk kompas. Jangan labelkan keputusan ini sebagai keputusan yang telah disahkan.


## 2. Polisi kanon dan penyelarasan rujukan

1. **Tingkatan 2 menggantikan Tingkatan 5** dalam fail helaian watak lama. Jangan ubah rupa atau pakaian asal Amir/Aisyah melainkan untuk varian dewasa dalam cutscene lompatan masa (asing daripada sprite remaja).
2. **Nama bos pada `assets/boss/boss_lima_tahap_terkini.png`** ialah nama rujukan grafik semasa. Perbincangan sebelum ini menggunakan nama sementara **Si Keliru, Buku Bercelaru, Penjaga Ayat, Kesatria Kesalahan, Maharaja Kekeliruan**. Dalam spesifikasi kod, gunakan **nama poster** sebagai tajuk bos; nama sementara kekal sebagai alias/rujukan sahaja, **bukan watak tambahan**.
3. **Kampung hub** dalam rakaman prototaip pernah menggunakan label Bandar TAK BSN dan watak lain (cth. Encik Bakar, Cikgu Nila). Aset ZIP dan pilihan terkini menjadi asas visual baharu; jangan buang prototaip yang berfungsi tanpa menyemak migrasi peta/interaksi dahulu.
4. **Syarat pendaftaran UPSI: token sahaja.** Lima halaman memulihkan buku dan membuka lima dunia, tetapi **bukan sijil/ujian kemasukan wajib**. Jika pemain mengumpul 1,500 token lebih awal melalui misi sampingan, pilihan UPSI masih wajar terbuka. `CADANGAN`: jika buku belum lengkap, berikan peringatan cerita **tanpa menyekat** pendaftaran; bos boleh diselesaikan dalam mod pascacerita.
5. **Kampus UPSI adalah lokasi pengakhiran dalam dunia permainan**, bukan Tahap 6 dengan latihan wajib. Setiap tahap 1–5 tetap mempunyai 5 misi + 1 bos. Cutscene UPSI tidak menjadi ujian tambahan.
6. **Keutamaan sumber:** keputusan pengguna terkini > aset grafik terkini > penjelasan daripada rakaman prototaip > cadangan awal pembantu.
7. Seluruh kandungan tambahan yang tidak dipilih jelas di bawah label `CADANGAN IMPLEMENTASI` (termasuk nama misi, dialog contoh, nombor masa bos, teknik pengkabelan dan butiran pangkalan data).


## 3. Aliran naratif penuh (prolog → dunia 1–5 → UPSI)

### PROLOG — Impian Seorang Pelajar (realistik)

**Babak P0: Rumah Amir, awal pagi.** Amir Tingkatan 2 merenung bahan pembelajaran dan foto/ilustrasi kampus. Dia bercita-cita menjadi mahasiswa UPSI suatu hari nanti, tetapi masih keliru menggunakan *tidak* dan *bukan*. Potret menunjukkan emosi risau → bersemangat.  
**Amir:** “Aku mahu belajar sampai ke universiti, tetapi kata nafi pun aku masih keliru.”  
**Aisyah:** “Kita boleh belajar bersama-sama. Jom cari bahan di perpustakaan lama!”

**Babak P1: Laluan kampung dan Perpustakaan Lama.** Pemandangan kampung normal dan tutorial joystick/WASD, interaksi NPC, butang buku, menu. Aisyah mengikuti Amir. Mereka menemui Buku Tatabahasa Misteri di rak lama. Buku berkilau, menunjukkan **lima halaman rosak** dan gangguan di dunia-dunia berbeza. Buku hanya **panduan/jurnal**, bukan portal wajib.

**Babak P2: Kampung berubah.** Beberapa papan tanda menjadi tidak gramatis, simbol kata berkedip, dan objektif 5 misi Tahap 1 muncul dalam Buku Misteri. Aisyah menerangkan bahawa membantu penduduk akan memulihkan halaman buku dan membolehkan Amir mengumpul token untuk **Tabung Universiti**.

### Gelung bab untuk setiap tahap

`Masuk kawasan → NPC / objek / penerokaan → tutorial ringkas Aisyah → pilih 5 misi bebas → 5 soalan setiap misi + ganjaran → semua 5 selesai → bos khas (3 nyawa) → bos menjadi halaman pulih → akses dunia berikutnya + kemajuan buku`.

### Tahap 1 — Kampung Permulaan

**Nada:** Kampung biasa bertukar pelik secara berperingkat; penduduk keliru memilih kata nafi.  
**Matlamat:** Membezakan asas *tidak* (frasa kerja / adjektif) dengan *bukan* (frasa nama / sendi nama).  
**Adegan bos:** Si Keliru / **Kekeliruan Nafi** muncul sebagai gabungan huruf dan kesalahan. Setelah 5 soalan diselesaikan, bos bersinar, kembali menjadi **Halaman Asas Kata Nafi**, dan jalan/portal ke Sekolah Misteri terbuka.  
**Dialog:** Aisyah — “Buku ini semakin jelas! Kita sudah membetulkan halaman pertama.”

### Tahap 2 — Sekolah Misteri

**Nada:** Kelas, papan kenyataan dan perpustakaan sekolah diganggu ayat tidak gramatis.  
**Matlamat:** Memilih kata nafi yang tepat dalam pelbagai ayat.  
**Adegan bos:** **Buku Tidak Gramatis** muncul daripada bahan bacaan. Selesaikan 7 soalan dalam cabaran bermasa. Bos kembali menjadi **Halaman Penggunaan Kata Nafi**. Laluan ke Hutan Bahasa terbuka.

### Tahap 3 — Hutan Bahasa

**Nada:** Jejak kata terpisah di hutan ajaib, akar berpintal membentuk ayat, jambatan bahasa.  
**Matlamat:** Membina/menyusun ayat gramatis.  
**Adegan bos:** **Pengacau Susunan Ayat** membaling serpihan perkataan. Selesaikan 9 teka-teki susunan ayat; bos menjadi **Halaman Pembinaan Ayat**. Jalan ke Istana Tatabahasa terbuka.

### Tahap 4 — Istana Tatabahasa

**Nada:** Dewan, arkib dan pintu istana terjejas kesalahan nafi; ketepatan lebih penting daripada kelajuan.  
**Matlamat:** Mengesan/membetulkan kesalahan, termasuk konteks khusus yang membawa maksud pertentangan.  
**Adegan bos:** **Benteng Kesalahan Nafi** mengunci pintu dengan ayat salah. Selesaikan 12 pembetulan; bos menjadi **Halaman Pembetulan Kesalahan**. Jalan ke Arena Penguasaan terbuka.

### Tahap 5 — Arena Penguasaan

**Nada:** Arena ungu, kristal dan altar buku; bunyi dan cahaya semakin megah.  
**Matlamat:** Mengaplikasikan *tidak* dan *bukan* dalam semua format.  
**Adegan bos:** **Penjaga Buku Tatabahasa** merupakan halaman terakhir yang rosak; bukan penjahat berniat jahat. Selesaikan 15 cabaran campuran; bos kembali menjadi **Halaman Penguasaan Kata Nafi**. Semua lima halaman bercahaya dan buku pulih sepenuhnya. Pemain menerima **Lencana Wira Tatabahasa** dalam profil, bukan pakaian khas.

### Pengumpulan token selepas Tahap 5

Jumlah ganjaran **CADANGAN** daripada 25 misi + 5 bos = **1,250 token** jika tidak berbelanja. Untuk tabung 1,500 token, Amir boleh mengulang misi sampingan dengan ganjaran tetap. **Pendaftaran tidak automatik**. Pemain perlu memilih sendiri masa sesuai dan memastikan 1,500 token **masih berada dalam tabung**, bukan sekadar pernah mencapai jumlah itu.

### EPILOG — Masa Berlalu, Impian ke UPSI

**Pencetus teknikal (DISAHKAN):** Simpanan ≥ 1,500 token → butang/objektif “Daftar ke UPSI” di kampus tersedia. Pemain boleh melawat kampus dan memilih **Daftar Sekarang** atau **Kembali Kemudian**. Tiada sijil, ujian atau syarat bos tambahan untuk pendaftaran.

**Babak U0: Transisi lompatan masa.** Teks pada skrin: **“Beberapa tahun kemudian…”**. Cerita menyatakan Amir telah menamatkan persekolahan, memenuhi syarat kemasukan yang diperlukan dalam dunia naratif dan menerima peluang belajar di UPSI. Ini tidak bermaksud murid Tingkatan 2 benar-benar boleh mendaftar sekarang. Gunakan varian pakaian dewasa untuk adegan UPSI tanpa mengubah rekaan asal sprite Tingkatan 2.

**Babak U1: Kampus UPSI (reka bentuk baharu diperlukan).** Kamera sinematik bergerak di sekitar pintu masuk kampus berilhamkan suasana Tanjong Malim, Perak; Amir dan Aisyah datang bersama. Paparan UI menunjukkan **Tabung Universiti: 1,500+**. NPC Pegawai Pendaftaran **(NPC baharu yang diperlukan)** menyambut kedatangan Amir.

**Babak U2: Pengesahan pendaftaran.**  
Pegawai: “Selamat datang ke UPSI, Amir. Adakah kamu ingin meneruskan pendaftaran dalam pengembaraan ini?”  
Amir: “Ya, saya bersedia!”  
Tetingkap ringkas: **“Gunakan 1,500 token daripada Tabung Universiti untuk pendaftaran simulasi?”** `[Sahkan]` `[Batal]`. Selepas `Sahkan`, semak baki di pelayan secara atomik; tolak **tepat 1,500 token sekali sahaja**. Jika baki tidak cukup akibat pengeluaran, tawarkan pulang ke Bank Impian dan jangan ubah status.

**Babak U3: Cutscene sinematik.** Muzik kemenangan, panorama bangunan kampus, potret Amir dan Aisyah gembira, cahaya keemasan lembut. **Tiada montaj flashback** (pengguna memilih cutscene sinematik sahaja).  
Amir: “Aisyah, akhirnya impian aku untuk belajar di UPSI menjadi kenyataan!”  
Aisyah: “Usaha dan ilmu yang kau kumpulkan membawamu sejauh ini, Amir!”  
Paparan: **“TAHNIAH! IMPIAN AMIR TERCAPAI!”**.

**Babak U4: Pasca-cerita.** Tetapkan `registered_at`, `ending_seen`, `university_success` secara kekal. Pemain boleh `Kembali Mengembara`, masuk mod meneroka/ulang latihan di era pengembaraan Tingkatan 2 (replay imaginatif), membeli barangan, mendapatkan lencana lain dan mengulang misi sampingan. **Jangan potong lagi 1,500 token apabila cutscene diulang**. Semua kemajuan sedia ada selamat.

**Nota naratif / fakta luar:** UPSI sebenar ialah **Universiti Pendidikan Sultan Idris**, di Tanjong Malim, Perak, dan mempunyai Kampus Sultan Abdul Jalil Shah serta Kampus Sultan Azlan Shah. Dunia game boleh memilih **gambaran fiksyen berilhamkan Kampus Sultan Abdul Jalil Shah**; jangan gambarkan kadar token atau pendaftaran dalam game sebagai yuran/syarat rasmi universiti. Rujukan: https://www.upsi.edu.my/campus/ dan https://www.upsi.edu.my/warisan/?lang=ms.


## 4. Reka bentuk watak & NPC (berpandukan aset asal)

![Aset Amir dan Aisyah](assets/watak/amir_aisyah.png)

### 4.1 Amir — Watak Utama

- **DISAHKAN:** Murid Tingkatan 2; rambut hitam; mahu melanjutkan pelajaran ke UPSI; kurang mahir kata nafi pada awal cerita; boleh dikawal pemain.
- **SUMBER ASET:** `assets/watak/amir_aisyah.png`, helaian pandangan depan/sisi/belakang, emosi dan gerakan contoh (idle, jalan, lari, interaksi); reka bentuk fizikal dan pakaian **dikekalkan**.
- **CADANGAN IMPLEMENTASI:** emosi `neutral`, `keliru`, `yakin`, `gembira`, `terkejut`; animasi berjalan 4 arah; watak kini mempunyai objek collision dan pemicu E/AKSI; stamina tiada agar fokus pendidikan. Dalam cutscene UPSI, sediakan **varian dewasa berasingan** yang konsisten rupa, bukan menggantikan sprite utama.

### 4.2 Aisyah — Sahabat / Rakan Pengembaraan

- **DISAHKAN:** Murid Tingkatan 2; memakai tudung; **mengikuti Amir automatik**; memberi nasihat, bantuan biasa dan 1 petunjuk istimewa percuma bagi setiap bos/cubaan.
- **SUMBER ASET:** dalam helaian `amir_aisyah.png` bersama gaya berjalan/ekspresi; pakaian dan bentuk asal kekal.
- **CADANGAN IMPLEMENTASI:** bergerak ~1–2 tile di belakang Amir, tidak menghalang laluan, kembali ke kedudukan selamat apabila terlalu jauh, menunggu dekat NPC semasa dialog, muncul dalam potret/bubble; varian dewasa hanya untuk epilog.

![Aset Encik Nazhif](assets/watak/encik_nazhif.png)

### 4.3 Encik Nazhif — Guru Bahasa Melayu

- **SUMBER ASET:** `assets/watak/encik_nazhif.png` — pelbagai sudut, ekspresi dan aksi mengajar/membaca/menasihati.
- **DISAHKAN:** NPC dewasa tetap di kawasan sekolah; pengajaran/tugasan guru boleh diakses melalui NPC dan Menu Tugasan.
- **CADANGAN IMPLEMENTASI:** NPC pintu masuk kelas; tutorial tahap 2, latihan tambahan daripada dashboard guru ditawarkan melalui menu dialognya, tetapi guru sebenar yang mencipta tugasan ditentukan oleh akaun kelas.

![Aset Razin, Izhan, Kelvin, Hazim](assets/npc/razin_izhan_kelvin_hazim.png)

### 4.4 NPC asal yang dikekalkan

| Watak | Ciri berdasarkan katalog / visual | Lokasi tetap dicadangkan | Fungsi permainan |
|---|---|---|---|
| **Razin** | Berkaca mata; penjaga kedai buku | Kedai Buku di hub | Petunjuk buku, misi ayat / buku |
| **Izhan** | Penjaga kios | Kedai Token / kios di hub | Jual kosmetik, power-up, koleksi; dialog urusan pembelian |
| **Kelvin** | Pembantu teknologi / komputer | Makmal Komputer di sekolah | Mini-game digital, bantuan masalah teknologi |
| **Hazim** | Pembantu kawasan / penyelenggaraan | Taman/Kawasan penyelenggaraan di hub | Misi penerokaan dan objek persekitaran |

**DISAHKAN:** NPC mempunyai **lokasi tetap**; NPC baharu hanya ditambah jika perlu. NPC dewasa tidak dilabel sebagai murid Tingkatan 2. Untuk watak Kelvin/Hazim, jika digambarkan sebagai murid, label Tingkatan 2.

### 4.5 NPC baharu minimum untuk menyempurnakan cerita (CADANGAN, belum direka)

- **Penjaga Perpustakaan Lama:** optional; boleh diganti dengan objek rak dan dialog Aisyah agar aset tidak bertambah.
- **Rakan sekolah tanpa nama:** optional untuk satu misi sekolah; boleh diwakili dialog papan kenyataan atau sprite NPC biasa.
- **Pegawai Pendaftaran UPSI:** **diperlukan** bagi adegan U1–U3, watak dewasa berpakaian kemas, potret dan sprite hadapan/sisi.
- **NPC tambahan di hutan/istana:** tidak diperlukan jika semua misi ditawarkan oleh objek; elakkan pergerakan NPC menyalahi prinsip lokasi tetap.

### 4.6 Raksasa Tatabahasa — identiti kanonik dalam aset

![Poster bos rasmi semasa](assets/boss/boss_lima_tahap_terkini.png)

| Tahap | Nama pada grafik asal (gunakan ini dalam HUD) | Nama sementara dari perbincangan | Personaliti / siluet | Hasil selepas tewas |
|---|---|---|---|---|
| 1 | **Kekeliruan Nafi** | Si Keliru | Makhluk huruf kecil, comel dan keliru | Halaman Asas Kata Nafi |
| 2 | **Buku Tidak Gramatis** | Buku Bercelaru | Buku hidup dengan teks rosak | Halaman Penggunaan Kata Nafi |
| 3 | **Pengacau Susunan Ayat** | Penjaga Ayat | Gabungan unsur hutan dan serpihan perkataan | Halaman Pembinaan Ayat |
| 4 | **Benteng Kesalahan Nafi** | Kesatria Kesalahan | Benteng / perisai huruf yang menguji ketepatan | Halaman Pembetulan Kesalahan |
| 5 | **Penjaga Buku Tatabahasa** | Maharaja Kekeliruan | Makhluk buku/tenaga ungu paling besar; klimaks | Halaman Penguasaan Kata Nafi |

**Penting:** setiap bos ialah **halaman rosak** — jangan menambah watak jahat utama. Bos kembali menjadi halaman apabila semua soalan selesai dan Amir masih mempunyai nyawa. Pastikan tiada gambar baharu daripada web menggantikan reka bentuk bos dalam ZIP.


### 4.7 Perincian reka bentuk visual asal — jangan reka semula tanpa sebab

| Watak | Pakaian/aksesori yang benar-benar kelihatan pada helaian asal | Pose/ekspresi rujukan | Nota pelaksanaan |
|---|---|---|---|
| **Amir** | Rambut hitam pendek berlapis; kemeja sekolah putih, tali leher hijau gelap, seluar gelap, beg galas hijau | depan, sisi, belakang; neutral, gembira, terkejut, berfikir, bersemangat, yakin; idle, jalan, lari, membaca/interaksi | Teks “Tingkatan 5” pada helaian ialah **label lama salah** — gunakan Tingkatan 2; jangan ubah uniform asal |
| **Aisyah** | Tudung putih/lavender muda, baju sekolah putih labuh, kain biru kehijauan, beg galas hijau | depan, sisi, belakang; neutral, gembira, terkejut, berfikir, serius, yakin; idle, jalan, lari, membaca/interaksi | Label Tingkatan 5 juga perlu ditukar ke Tingkatan 2; kekalkan tudung dan uniform |
| **Encik Nazhif** | Rambut gelap, cermin mata, kemeja lengan bergulung warna ungu kelabu muda, tali leher gelap, seluar gelap, kad pengenalan bertali | neutral, senyum, gembira, berfikir, serius, galakan; membaca, menerangkan, menulis, menasihati | Guru dewasa, tidak termasuk dalam “semua murid Tingkatan 2” |
| **Razin** | Rambut gelap, cermin mata hitam, baju kolar dan apron warna marun | membaca buku, menyambut pelanggan, menyusun buku | Penjaga kedai buku (NPC tetap) |
| **Izhan** | Topi merah putih, pakaian pekerja rona marun dan apron hijau | memberi belian, menyapa pelanggan, menyiapkan pesanan | Penjaga kios (NPC tetap) |
| **Kelvin** | Rambut gelap kecoklatan, jaket biru, fon kepala pada leher, tali kad | menggunakan komputer, menerangkan, membawa peralatan | Pembantu teknologi (NPC tetap) |
| **Hazim** | Topi hijau zaitun, vest keselamatan kuning cerah, pakaian kerja, kain di bahu | membawa kotak, menunjuk arah, menyapu/membersih | Pembantu kawasan (NPC tetap) |

**Perincian teknikal seni:** Helaian ialah kolaj konsep berlabel, **bukan** fail sprite animasi siap eksport. Jangan memotong elemen teks/label daripada kolaj sebagai tekstur watak. Semasa pembangunan, bina sprite tanpa latar poster dan gunakan skala piksel/proporsi yang seragam. Untuk cutscene UPSI selepas lompatan masa, varian pakaian dewasa Amir dan Aisyah ialah **aset tambahan sinematik sahaja**, bukannya perubahan identiti/penampilan asal ketika Tingkatan 2.

## 5. Reka bentuk latar, dunia dan peta (aset asal)

### 5.1 Prinsip seni keseluruhan

- **DISAHKAN:** Pixel Art **Moden + Comel**, pandangan atas top-down untuk penerokaan, paparan landskap, watak chibi/ekspresif, lima dunia realistik/fantasi.
- **CADANGAN:** UI panel biru gelap, sentuhan emas dan ungu ajaib yang serasi dengan helaian konsep; skala piksel perlu konsisten, tanpa penapisan yang mengaburkan piksel; skrin 16:9 dan adaptif pelbagai resolusi.
- **JANGAN** anggap PNG konsep sebagai tilemap atau spritesheet boleh dimainkan. Ia perlu dipecahkan/reka semula menjadi lapisan render (`ground`, `path`, `decor`, `collision`, `interact`, `foreground`), titik spawn dan pintu/portal; helaian watak perlu dipotong animasi dengan pengesahan bingkai.

### 5.2 Kampung TAK BSN (central hub) + Tahap 1

![Peta konsep Kampung Permulaan semasa](assets/latar/tahap_01_kampung_permulaan.png)

- **SUMBER ASET:** `assets/latar/tahap_01_kampung_permulaan.png` (1672×941), dengan rumah kampung, kebun, sungai, jambatan, laluan tanah, pokok dan ruang interaksi.
- **SUMBER ASET ALTERNATIF:** `assets/latar/tahap_01_kampung_permulaan_konsep_awal.png` (1448×1086), rumah tradisional/pondok dan unsur buku. Gunakan **peta semasa** sebagai rujukan utama, alternatif untuk idea sahaja.
- **Fasa sebelum penemuan:** kampung biasa — cahaya pagi, papan tanda gramatis, tiada efek gangguan.
- **Fasa selepas penemuan:** papan tanda perkataan bercelaru, simbol bercahaya, lima penanda misi kelihatan. **Tidak perlu menggantikan keseluruhan peta**; guna lapisan VFX/objek yang berubah.
- **Bangunan/zon hub yang diperlukan (cadangan):** Rumah Amir (spawn awal), Perpustakaan Lama (prolog), Kedai Buku Razin, Kios/Kedai Token Izhan, Bank Impian (deposit/withdraw), sekolah (pintu ke Tahap 2), portal/papan peta, taman Hazim, laluan rahsia. Lokasi sekolah dan kedai wujud dalam rakaman prototaip lama tetapi perlu dipadankan kepada peta konsep yang anda pilih.
- **NPC tetap:** Razin di kedai buku, Izhan di kios, Hazim di taman; guru dan Kelvin di sekolah.
- **Peta prototaip berfungsi:** rakaman lama menunjukkan Bandar TAK BSN, jalan tar, taman, rumah, sekolah dan Kedai Token dengan joystick/AKSI; ia adalah rujukan aliran UI, bukan pengganti automatik kepada peta konsep terbaru.

### 5.3 Tahap 2 — Sekolah Misteri

![Pratonton Sekolah Misteri (BUKAN peta penuh)](assets/latar/tahap_02_sekolah_misteri_pratonton.png)

- **SUMBER ASET:** `assets/latar/tahap_02_sekolah_misteri_pratonton.png` (861×438) ialah **potongan pratonton poster bos**, **bukan peta top-down lengkap**.
- **ASET WAJIB DIBINA:** peta penuh sekolah dari atas: pintu pagar, koridor, bilik darjah Encik Nazhif, makmal Kelvin, papan kenyataan, sudut bacaan, ruang latihan dan pintu arena bos. Warna menyerupai seni aset lain.
- **Gangguan:** teks buku/papan kenyataan berubah; ruang belajar kekal mesra murid, bukan seram.

### 5.4 Tahap 3 — Hutan Bahasa

![Peta konsep Hutan Bahasa](assets/latar/tahap_03_hutan_bahasa.png)

- **SUMBER ASET:** `assets/latar/tahap_03_hutan_bahasa.png` (1672×941), pokok purba, air terjun/sungai, cendawan bercahaya, runtuhan dan laluan bersimpang.
- **Peta interaksi (cadangan):** lima kawasan sesuai dengan misi: laluan serpihan, jambatan, cendawan, pokok purba, gerbang rune. Gunakan kabus ringan/zarah huruf ketika gangguan; tiada labirin yang memerangkap murid.

### 5.5 Tahap 4 — Istana Tatabahasa

![Peta konsep Istana Tatabahasa](assets/latar/tahap_04_istana_tatabahasa.png)

- **SUMBER ASET:** `assets/latar/tahap_04_istana_tatabahasa.png` (1672×941), menara, jalan batu, taman simetri, air pancut, jambatan dan pintu masuk besar.
- **Peta interaksi (cadangan):** gerbang, taman, arkib, air pancut pertentangan, balairung/arena bos. Elemen kesalahan muncul sebagai panel teks retak, bukan raksasa baharu.

### 5.6 Tahap 5 — Arena Penguasaan

![Peta konsep Arena Penguasaan](assets/latar/tahap_05_arena_penguasaan.png)

- **SUMBER ASET:** `assets/latar/tahap_05_arena_penguasaan.png` (1672×941), altar buku bercahaya, kristal ungu, bulatan rune dan lantai arena.
- **Peta interaksi (cadangan):** lima gelung pembelajaran yang berbeza, butang untuk lima misi dan pintu masuk bos akhir. Animasi halaman bersatu selepas menang.

### 5.7 Epilog — Kampus UPSI (ASET BELUM ADA)

- **SUMBER FAKTA:** UPSI sebenar terletak di **Tanjong/Tanjung Malim, Perak** dan mempunyai **Kampus Sultan Abdul Jalil Shah** dan **Kampus Sultan Azlan Shah** (https://www.upsi.edu.my/campus/).
- **CADANGAN VISUAL:** gambaran berilhamkan **Kampus Sultan Abdul Jalil Shah** dalam gaya pixel-art comel — pintu masuk, landskap hijau, papan nama “UPSI” (semak hak penggunaan logo), laluan ke kaunter pendaftaran simulasi, latar sinematik.
- **ASET BAHARU WAJIB:** `assets/latar/upsi_kampus_epilog.png`, `assets/latar/upsi_kaunter_pendaftaran.png`, `assets/watak/amir_dewasa_cutscene.png`, `assets/watak/aisyah_dewasa_cutscene.png`, `assets/npc/pegawai_pendaftaran_upsi.png`. Nama fail ini **cadangan output pembangunan**, bukan fail sedia ada.
- Reka bentuk hendaklah **diinspirasikan** kampus sebenar; jangan mengaku sebagai gambaran rasmi, jangan menggunakan logo/tanda dagang tanpa semakan keizinan yang sesuai, dan jangan memaparkan yuran token sebagai maklumat universiti sebenar.

### 5.8 Rujukan tambahan dalam ZIP

![Konsep NPC/bos terdahulu](assets/npc/konsep_npc_boss_terdahulu.png)

![Rujukan peta RPG](assets/rujukan/rujukan_peta_rpg.png)

![Rujukan sprite watak](assets/rujukan/rujukan_sprite_watak.png)

- `assets/npc/konsep_npc_boss_terdahulu.png`: **rujukan arkib sahaja**, susunan bos lama **bukan kanon**.
- `assets/rujukan/rujukan_peta_rpg.png`: mood board peta 2D.
- `assets/rujukan/rujukan_sprite_watak.png`: rujukan gerakan sprite; bukan watak Amir/Aisyah terkini.
- `docs/KATALOG_GRAFIK_ASAL.md`: dokumen katalog asal dalam ZIP. Mengandungi label Tingkatan 5 **yang telah dibetulkan oleh pengguna**. Jangan menyalin label lama itu dalam UI.


### 5.9 Manifest lengkap PNG asal (13 fail)

Semua resolusi berikut diambil daripada fail asal yang anda muat naik, bukan daripada imej contoh luar.

| Fail | Resolusi piksel | Status |
|---|---:|---|
| `assets/boss/boss_lima_tahap_terkini.png` | 1536 × 1024 | Konsep visual |
| `assets/latar/tahap_01_kampung_permulaan.png` | 1672 × 941 | Konsep visual |
| `assets/latar/tahap_01_kampung_permulaan_konsep_awal.png` | 1448 × 1086 | Konsep visual |
| `assets/latar/tahap_02_sekolah_misteri_pratonton.png` | 861 × 438 | Konsep utama/pratonton |
| `assets/latar/tahap_03_hutan_bahasa.png` | 1672 × 941 | Konsep visual |
| `assets/latar/tahap_04_istana_tatabahasa.png` | 1672 × 941 | Konsep visual |
| `assets/latar/tahap_05_arena_penguasaan.png` | 1672 × 941 | Konsep visual |
| `assets/npc/konsep_npc_boss_terdahulu.png` | 1536 × 1024 | Rujukan, bukan kanon |
| `assets/npc/razin_izhan_kelvin_hazim.png` | 1254 × 1254 | Konsep visual |
| `assets/rujukan/rujukan_peta_rpg.png` | 1920 × 1080 | Rujukan, bukan kanon |
| `assets/rujukan/rujukan_sprite_watak.png` | 341 × 341 | Rujukan, bukan kanon |
| `assets/watak/amir_aisyah.png` | 1254 × 1254 | Konsep visual |
| `assets/watak/encik_nazhif.png` | 1254 × 1254 | Konsep visual |

## 6. Peta pengembaraan, penerokaan dan urutan buka tahap

```
[HUB: Kampung TAK BSN]
  ├── Rumah Amir / Perpustakaan Lama / Bank Impian / Kedai Token
  ├── Peta + portal + laluan rahsia (akses kawasan SUDAH DIBUKA)
  ├── Tahap 1 Kampung Permulaan: 5 misi → Bos 1 → Halaman 1
  ├── Tahap 2 Sekolah Misteri: 5 misi → Bos 2 → Halaman 2
  ├── Tahap 3 Hutan Bahasa: 5 misi → Bos 3 → Halaman 3
  ├── Tahap 4 Istana Tatabahasa: 5 misi → Bos 4 → Halaman 4
  └── Tahap 5 Arena Penguasaan: 5 misi → Bos 5 → Halaman 5

[LOKASI PENAMAT: Kampus UPSI] — akses apabila Tabung ≥ 1,500;
  pilihan daftar adalah SUKARELA, dan cerita melompat beberapa tahun.
```

- **Tahap 1 terbuka dari permulaan** selepas prolog. Tahap `n+1` terbuka setelah `boss_n` menang.
- **Tidak boleh pintas kunci tahap** melalui portal/laluan rahsia/peta.
- **UPSI hanya memerlukan token** sebagai syarat kemasukan dalam game; jangan secara tidak sengaja mewajibkan lencana atau bos ke-5. Namun susun cerita/ganjaran supaya jalan biasa membawa pemain menyelesaikan 5 tahap terlebih dahulu.
- Peta menunjukkan status `dikunci`, `tersedia`, `dalam_proses`, `selesai`, dan pilihan `kembali ke hub`.
- Semasa satu misi aktif dijejak, kompas arah menunjuk objektif misi itu; tanda `!` atas NPC/objek yang menawarkan misi; buku menyenaraikan semua tugas yang sedang aktif dan yang selesai.
- NPC di lokasi tetap; hanya Amir/Aisyah bergerak antara kawasan. Mini-game interaktif muncul sebagai overlay dan tidak memaksa penukaran peta. Bos menggunakan transisi sinematik dan paparan berasingan.


## 7. Sistem misi terperinci (25 misi)

**Syarat DISAHKAN:** setiap tahap mempunyai **5 misi bebas**; misi bermula selepas pengguna memilih **Terima** dalam dialog NPC/objek, atau **Tolak** tanpa penalti. **Setiap misi mengandungi tepat 5 soalan.** Setelah selesai, pemain memperoleh token mengikut tahap, jurnal merekod hasil dan misi itu tidak lagi perlu dibuat sebelum bos. Misi utama tidak perlu diulang untuk token (cadangan anti-farming; misi sampingan memang boleh diulang).

**CADANGAN:** Boleh menerima sehingga kelima-lima misi tahap tersebut serentak; kompas hanya menjejak satu misi pada satu masa. Aset baharu hanya jika lokasi/NPC asal tidak mencukupi. Nama misi dan urusan khusus di bawah ialah **rancangan kandungan** untuk menyempurnakan aliran cerita, bukan keputusan nama yang pernah disahkan.


### Tahap 1 — Kampung Permulaan

**Fokus:** Perbezaan asas frasa nama/sendi nama dengan frasa kerja/adjektif. **Ganjaran setiap misi (cadangan):** 10 token.

| ID | Nama misi | Lokasi | Konflik & aktiviti | Pemberi misi / interaksi |
|---|---|---|---|---|
| `S1-M1` | **Papan Tanda Pelik** | Jalan Kampung | Papan kenyataan awam memaparkan ayat terbalik. **Tugasan:** Periksa lima papan dan pilih kata nafi yang tepat. **5 soalan** | Objek papan tanda / penanda ! |
| `S1-M2` | **Pesanan Razin** | Kedai Buku | Razin bimbang label buku menjadi mengelirukan. **Tugasan:** Bantu Razin mengelaskan lima pesanan. **5 soalan** | Razin — penjaga kedai buku |
| `S1-M3` | **Stok Kios Izhan** | Kios / Kedai Token | Senarai bekalan kios menjadi tidak gramatis. **Tugasan:** Betulkan lima pernyataan inventori. **5 soalan** | Izhan — penjaga kios |
| `S1-M4` | **Jejak Taman Hazim** | Taman Kampung | Lima papan arah di taman terganggu. **Tugasan:** Cari tanda berkaitan dan jawab lima soalan. **5 soalan** | Hazim — pembantu kawasan |
| `S1-M5` | **Rak Perpustakaan Lama** | Perpustakaan Lama | Rak rujukan tempat buku ditemui mula bercahaya. **Tugasan:** Susun semula lima catatan kata nafi. **5 soalan** | Objek rak buku + Aisyah |

**Bos:** **Kekeliruan Nafi**; 5 soalan; Aneka pilihan: lima soalan, setiap jawapan betul menyingkirkan satu simbol kesalahan. **Hasil:** Halaman Asas Kata Nafi.


### Tahap 2 — Sekolah Misteri

**Fokus:** Memilih kata nafi dalam ayat dan dialog. **Ganjaran setiap misi (cadangan):** 20 token.

| ID | Nama misi | Lokasi | Konflik & aktiviti | Pemberi misi / interaksi |
|---|---|---|---|---|
| `S2-M1` | **Nota Encik Nazhif** | Bilik Darjah | Nota kelas Tingkatan 2 bercampur dengan ayat yang salah. **Tugasan:** Pilih kata nafi yang tepat bagi lima ayat. **5 soalan** | Encik Nazhif |
| `S2-M2` | **Papan Kenyataan Misteri** | Koridor Sekolah | Pengumuman sekolah berubah menjadi tidak gramatis. **Tugasan:** Pulihkan lima pengumuman. **5 soalan** | Objek papan kenyataan |
| `S2-M3` | **Kod Kelvin** | Makmal Komputer | Sistem latihan komputer memaparkan pilihan kata nafi yang keliru. **Tugasan:** Selesaikan lima padanan digital. **5 soalan** | Kelvin — pembantu teknologi |
| `S2-M4` | **Buku Pinjaman** | Sudut Bacaan Sekolah | Lima kad peminjaman tidak mempunyai kata nafi yang betul. **Tugasan:** Lengkapkan ayat pada kad. **5 soalan** | Objek rak buku |
| `S2-M5` | **Dialog Rakan Kelas** | Ruang Latihan Sekolah | Perbualan rakan sekolah menimbulkan salah faham. **Tugasan:** Pilih lima respons yang sesuai. **5 soalan** | NPC rakan kelas tambahan jika perlu |

**Bos:** **Buku Tidak Gramatis**; 7 soalan; Cabaran bermasa: tujuh soalan sebelum pemasa setiap soalan tamat. **Hasil:** Halaman Penggunaan Kata Nafi.


### Tahap 3 — Hutan Bahasa

**Fokus:** Membina dan menyusun ayat yang gramatis. **Ganjaran setiap misi (cadangan):** 30 token.

| ID | Nama misi | Lokasi | Konflik & aktiviti | Pemberi misi / interaksi |
|---|---|---|---|---|
| `S3-M1` | **Jejak Perkataan** | Laluan Barat Hutan | Serpihan kata bertaburan di sepanjang laluan. **Tugasan:** Kutip cip perkataan dan susun lima ayat. **5 soalan** | Objek cip kata |
| `S3-M2` | **Jambatan Ayat** | Jambatan Hutan | Jambatan hanya kukuh apabila ayat lengkap. **Tugasan:** Bina lima ayat untuk mengukuhkan jambatan. **5 soalan** | Objek jambatan |
| `S3-M3` | **Cendawan Nafi** | Kawasan Cendawan | Cendawan bercahaya memaparkan potongan ayat bercampur. **Tugasan:** Padankan lima frasa menjadi ayat gramatis. **5 soalan** | Objek cendawan |
| `S3-M4` | **Pokok Ingatan** | Pokok Purba | Akar pokok menyembunyikan lima pesanan. **Tugasan:** Susun lima pesanan dengan betul. **5 soalan** | Objek pokok purba |
| `S3-M5` | **Gerbang Sunyi** | Gerbang Runtuhan | Gerbang ke bos dikunci oleh ayat tidak lengkap. **Tugasan:** Baiki lima ayat untuk mendapatkan lambang gerbang. **5 soalan** | Objek pintu rune |

**Bos:** **Pengacau Susunan Ayat**; 9 soalan; Teka-teki susun ayat: sembilan susunan kata. **Hasil:** Halaman Pembinaan Ayat.


### Tahap 4 — Istana Tatabahasa

**Fokus:** Mengesan dan membetulkan kesalahan dalam pelbagai konteks. **Ganjaran setiap misi (cadangan):** 40 token.

| ID | Nama misi | Lokasi | Konflik & aktiviti | Pemberi misi / interaksi |
|---|---|---|---|---|
| `S4-M1` | **Gerbang Kesalahan** | Pintu Istana | Penjaga pintu memaparkan ayat yang tersilap. **Tugasan:** Betulkan lima ayat sebelum memasuki istana. **5 soalan** | Objek pintu |
| `S4-M2` | **Taman Perintah** | Taman Istana | Arahan pada pancang taman tersusun dengan kata nafi salah. **Tugasan:** Baca dan baiki lima pernyataan. **5 soalan** | Objek papan taman |
| `S4-M3` | **Arkib Berdebu** | Arkib Istana | Manuskrip arkib mengandungi kesalahan yang berulang. **Tugasan:** Semak lima petikan. **5 soalan** | Objek manuskrip |
| `S4-M4` | **Air Pancut Pertentangan** | Dataran Air Pancut | Tulisan magis menukar maksud penegasan menjadi pertentangan. **Tugasan:** Pilih lima ayat yang tepat dalam konteks. **5 soalan** | Objek air pancut |
| `S4-M5` | **Balairung Betul Salah** | Balairung | Lima panel dinding menyoal ketepatan ayat. **Tugasan:** Betulkan ayat untuk membuka akses bos. **5 soalan** | Objek panel batu |

**Bos:** **Benteng Kesalahan Nafi**; 12 soalan; Pengesanan kesalahan: dua belas ayat perlu diperbetulkan. **Hasil:** Halaman Pembetulan Kesalahan.


### Tahap 5 — Arena Penguasaan

**Fokus:** Aplikasi gabungan, termasuk maksud pertentangan secara berpandu. **Ganjaran setiap misi (cadangan):** 50 token.

| ID | Nama misi | Lokasi | Konflik & aktiviti | Pemberi misi / interaksi |
|---|---|---|---|---|
| `S5-M1` | **Lingkaran Nama** | Lingkaran Rune Pertama | Simbol kata nama mula malap. **Tugasan:** Pulihkan lima ayat berunsur frasa nama. **5 soalan** | Objek lingkaran rune |
| `S5-M2` | **Kristal Perbuatan** | Kawasan Kristal | Kristal berkaitan perbuatan mengalami gangguan. **Tugasan:** Selesaikan lima ayat frasa kerja. **5 soalan** | Objek kristal |
| `S5-M3` | **Cermin Sifat** | Cermin Ajaib | Cermin memantulkan kata adjektif yang salah. **Tugasan:** Baiki lima pernyataan sifat. **5 soalan** | Objek cermin |
| `S5-M4` | **Jejak Pertentangan** | Laluan Rune | Ayat yang membawa maksud pertentangan kehilangan kejelasan. **Tugasan:** Selesaikan lima pilihan konteks. **5 soalan** | Objek rune |
| `S5-M5` | **Pentas Penguasaan** | Altar Buku | Lima kunci pengetahuan terpisah daripada Buku Misteri. **Tugasan:** Lulus lima cabaran gabungan. **5 soalan** | Objek altar |

**Bos:** **Penjaga Buku Tatabahasa**; 15 soalan; Bos gabungan: lima belas soalan pelbagai format. **Hasil:** Halaman Penguasaan Kata Nafi.


### 7.6 Misi sampingan berulang (bukan sebahagian 25 misi)

**DISAHKAN:** boleh diulang tanpa had yang ditentukan dalam perbincangan; jumlah token bagi **misi yang sama sentiasa sama** pada setiap kejayaan. Jangan kurangkan ganjaran bagi ulangan kedua. Bank soalan boleh diacak untuk mengelakkan hafalan.

| ID cadangan | Lokasi/NPC tetap | Aktiviti | Token setiap kemenangan (CADANGAN) |
|---|---|---|---:|
| `SIDE-EASY` | Razin / Kedai Buku | Lima pilihan asas *tidak/bukan* | 10 |
| `SIDE-MED` | Encik Nazhif / Sekolah | Lima ayat konteks | 20 |
| `SIDE-HARD` | Kelvin / Makmal Komputer | Lima pembetulan atau susunan | 30 |

**Keseimbangan:** jika 1,250 token dari semua misi utama/bos tidak dibelanjakan, pemain memerlukan sekurang-kurangnya **250 token** daripada misi sampingan untuk menyimpan 1,500. Jika berbelanja, perlu lebih. Pastikan pemain tidak terperangkap tanpa sumber token, boleh memulakan ulang misi walau selepas pendaftaran UPSI, dan hadiah yang sama tidak digandakan hanya kerana refresh/reconnect.

### 7.7 Tugasan guru

Kandungan utama 25 misi **tetap**. Guru mencipta latihan tambahan melalui Dashboard Guru, memilih kelas/individu dan jenis interaksi: **aneka pilihan, isi tempat kosong, susun perkataan, padanan, pembetulan kesalahan**. Tugasan yang sama boleh diakses melalui **Menu Tugasan** atau **NPC Encik Nazhif**, tetapi menggunakan `assignment_id` yang sama (jawab sekali bagi setiap percubaan sah). Status `baharu/dalam_proses/dihantar/dinilai`. Tugasan guru tidak patut mengubah skrip 25 misi; ganjaran token latihan guru belum diputuskan, maka **cadangan selamat: tiada token lalai** sehingga guru/pemilik projek mengesahkan.


## 8. Pertarungan bos — sistem penuh

| Tahap | Bos dari aset | Bentuk pertarungan | Soalan wajib | Token bos (cadangan) | Halaman dipulihkan |
|---|---|---|---:|---:|---|
| 1 | Kekeliruan Nafi | Aneka pilihan: lima soalan, setiap jawapan betul menyingkirkan satu simbol kesalahan | **5** | **50** | Halaman Asas Kata Nafi |
| 2 | Buku Tidak Gramatis | Cabaran bermasa: tujuh soalan sebelum pemasa setiap soalan tamat | **7** | **75** | Halaman Penggunaan Kata Nafi |
| 3 | Pengacau Susunan Ayat | Teka-teki susun ayat: sembilan susunan kata | **9** | **100** | Halaman Pembinaan Ayat |
| 4 | Benteng Kesalahan Nafi | Pengesanan kesalahan: dua belas ayat perlu diperbetulkan | **12** | **125** | Halaman Pembetulan Kesalahan |
| 5 | Penjaga Buku Tatabahasa | Bos gabungan: lima belas soalan pelbagai format | **15** | **150** | Halaman Penguasaan Kata Nafi |

### Peraturan keadaan (DISAHKAN)

- Masuk bos hanya selepas 5 misi utama bagi tahap itu selesai.
- Mula setiap percubaan dengan **3 nyawa**. Nyawa tidak dibawa daripada bos terdahulu.
- Jawapan **betul** → rekod percubaan dan bergerak ke **soalan seterusnya**.
- Jawapan **salah** → rekod percubaan, **tolak 1 nyawa**, kekalkan **soalan yang sama**, paparkan petunjuk/penerangan yang sesuai. Jawab semula hingga betul atau 0 nyawa.
- **0 nyawa** → paparan kalah + `Cuba Lagi` / `Kembali`; percubaan baharu 3 nyawa dari soalan pertama dengan **set dan turutan soalan yang sama**.
- Menang hanya setelah **semua soalan wajib dijawab dengan betul**, masih mempunyai **≥1 nyawa**, dan status kemenangan direkodkan. Bos berubah menjadi halaman, akses dunia baru dibuka.
- **1 petunjuk istimewa Aisyah percuma bagi setiap percubaan bos**; tidak ditolak dari inventori, **tidak dikira** dalam had power-up. Maklum balas pengajaran automatik selepas kesalahan tetap percuma dan **bukan** “petunjuk istimewa” tambahan.
- **Maksimum 1 power-up berbayar yang dibeli bagi setiap soalan** (petunjuk tambahan, perisai, atau pulih nyawa). Butang pantas tersedia semasa pertarungan; inventori besar tidak perlu dibuka.
- **Perisai** melindungi 1 kehilangan nyawa berikutnya; jawapan salah masih direkod, soalan perlu dicuba semula. **Pulih nyawa** tambah 1 tetapi maksimum 3. **Petunjuk berbayar** memberikan bimbingan, bukan terus jawapan.
- Setiap kemenangan bos / halaman / hadiah token bersifat **idempoten**: ganjaran utama diberikan sekali bagi bos yang pertama kali menang. Main semula untuk latihan tidak menggandakan token utama.

### Cadangan untuk bos bermasa Tahap 2

- Tentukan pemasa **mengikut soalan**, contohnya 30–45 saat (nilai ini **belum disahkan**). Habis masa dianggap satu percubaan salah dan menolak satu nyawa, kemudian masa diperbaharui untuk soalan **yang sama**.
- Apabila tetingkap sistem, latihan nota, atau bantuan aksesibiliti digunakan, hentikan pemasa dalam keadaan yang wajar; jangan menghukum murid kerana kelewatan rangkaian.
- Animasi sinematik tidak menggunakan masa soal jawab. Pemasa dikendalikan oleh pelayan/masa monotonic jika memerlukan ketepatan.

### Mesin keadaan bos (CADANGAN)

`locked → ready → intro → answering(questionIndex, lives, usedPaidPowerup, freeHintUsed) → (correct → next | wrong → retrySame | lives0 → failed) → won → restoredPage → unlockedNext`.

Pada `retrySame`, `usedPaidPowerup` kekal **terpakai bagi soalan itu** sehingga jawapan betul; jangan benarkan pengguna menggunakan satu item baharu selepas setiap kesilapan pada soalan yang sama. `freeHintUsed` cuma reset pada **percubaan bos baharu**; selepas berpindah soalan, satu power-up berbayar boleh digunakan lagi.


## 9. Pembelajaran tatabahasa, maklum balas dan bank soalan

### 9.1 Fakta tatabahasa untuk semakan kandungan

**Asas:** Kata nafi **bukan** lazimnya hadir sebelum **frasa nama** dan **frasa sendi nama**. Kata nafi **tidak** lazimnya hadir sebelum **frasa kerja** dan **frasa adjektif**. **Pengecualian penting:** **bukan** boleh hadir sebelum frasa kerja atau adjektif jika ayat membawa **maksud pertentangan maklumat** (“bukan ... tetapi ...”). Jangan bina kuiz yang salah menandakan semua penggunaan “bukan” sebelum kata kerja sebagai salah tanpa melihat konteks. Sumber tatabahasa: Pusat Rujukan Persuratan Melayu, DBP — https://prpm.dbp.gov.my/Cari1?d=175768&keyword=bukan.

**Peringkat kesukaran (DISAHKAN):** Tahap 1 mudah, Tahap 2 mudah/sederhana, Tahap 3 sederhana, Tahap 4 sukar, Tahap 5 sangat sukar. Tingkatan 2 ialah **umur/aras sasaran**, bukan tuntutan semua soalan sukar hingga setaraf peperiksaan sebenar.

### 9.2 Lima jenis soalan

1. **MCQ dua pilihan** — pilih *tidak* / *bukan* untuk ayat; gunakan petunjuk frasa.
2. **Isi tempat kosong** — pilih/taip kata nafi yang hilang; semak aksara besar/kecil dan ruang kosong secara selamat.
3. **Susun perkataan** — seret/sentuh cip kata membentuk ayat rujukan yang gramatis; validasi urutan dan kemungkinan alternatif yang sah secara dirancang.
4. **Padanan** — padankan frasa / ayat dengan *tidak* atau *bukan*; skrip jawapan tidak boleh bergantung pada susunan skrin.
5. **Betulkan kesalahan** — ayat dengan kata nafi salah; pemain memilih kata nafi pengganti (atau memilih frasa dibetulkan). Untuk konteks pertentangan, semak seluruh ayat.

**Cadangan UX:** butang besar, papan kekunci dan sentuhan, ikon/tulisan yang boleh dibaca pada landskap mudah alih, petunjuk Aisyah, maklum balas yang menjelaskan **sebab** dan bukan sekadar `Betul/Salah`.

### 9.3 Aliran maklum balas

- Ketika latihan/misi, jika salah, beri petunjuk berperingkat; jika perlu jelaskan peraturan dengan contoh. Ketika bos, peraturan -1 nyawa dan cuba soalan sama tetap berjalan.
- Selepas set latihan selesai, laporan keputusan memperlihatkan kesalahan dan penerangan; **tetapi peratus penguasaan terkumpul disembunyikan di sini dan di HUD** kerana pengguna memilih paparan **hanya dalam profil**. Laporan boleh menyatakan bilangan betul, bilangan cubaan, dan penjelasan per-item tanpa menonjolkan metrik penguasaan terkumpul.
- Peringatan automatik selepas salah **bukan** petunjuk khas Aisyah 1 kali / bos; bezakan UI “Nasihat selepas salah” dengan butang “Petunjuk Aisyah (1)”.
- Semua jawapan yang **dihantar** direkod, termasuk cubaan salah sebelum jawapan betul. Jawapan tidak dihantar atau soalan hanya dibuka tidak menambah penyebut.

### 9.4 Peratus penguasaan (ketepatan terkumpul)

`peratus = (jumlah submission betul ÷ jumlah semua submission yang dijawab) × 100`.

- Termasuk semua jawapan dalam misi, mini-game, bos, misi sampingan dan latihan guru yang dinilai (setiap submission dicatat satu kali; elak catatan gandaan selepas reconnect).
- Papar peratus **dalam Profil Pemain sahaja** dan dalam laporan guru yang dibenarkan. Jangan letak dalam HUD, dialog kemenangan atau skrin keputusan sebagai “peratus penguasaan”.
- Jika penyebut sifar, papar `Belum dinilai` — jangan dakwa 0% menunjukkan kurang mahir.
- Dalam laporan guru, simpan juga metrik **jawapan percubaan pertama** secara berasingan untuk konteks (cadangan), tetapi jangan menggantikan formula pilihan pengguna.
- Peratus ini ialah **ketepatan latihan terkumpul**, bukan penentuan Tahap Penguasaan PBD secara automatik.

### 9.5 Bank soalan lengkap

**Fail untuk Claude Code:** [`data/TAK_BSN_SOALAN_173.json`](data/TAK_BSN_SOALAN_173.json) — **173 rekod soalan contoh siap dengan ID, tahap, misi/bos, jenis, ayat, jawapan, peraturan & penerangan**. Bahagian **Lampiran A** dalam dokumen ini menyenaraikan semua soalan supaya `.md` boleh dibaca sendiri. Semak kandungan dengan guru Bahasa Melayu sebelum menjadikannya versi pentaksiran rasmi. Format “susun perkataan” boleh disesuaikan daripada ayat rujukan ke cip kata.

**Kiraan:** 25 misi × 5 = **125**, bos `5 + 7 + 9 + 12 + 15 = 48`, jumlah **173**. Set 173 adalah kandungan asas dan boleh diuji; bank soalan sampingan dan tugasan guru perlu dicipta/dipilih secara berasingan.


## 10. Ekonomi, Bank Impian, Kedai dan inventori

### 10.1 Ganjaran utama — CADANGAN angka, mekanik kesukaran DISAHKAN

| Tahap | 5 misi × token setiap misi | Bos | Subjumlah |
|---|---:|---:|---:|
| 1 | 5 × 10 = 50 | 50 | 100 |
| 2 | 5 × 20 = 100 | 75 | 175 |
| 3 | 5 × 30 = 150 | 100 | 250 |
| 4 | 5 × 40 = 200 | 125 | 325 |
| 5 | 5 × 50 = 250 | 150 | 400 |
| **Jumlah** | **750** | **500** | **1,250** |

**DISAHKAN:** ganjaran meningkat mengikut kesukaran tahap, misi sampingan yang sama membayar kadar sama bagi setiap ulangan. Kadar angka di atas **cadangan perbincangan**, bukan keputusan nilai muktamad. Simpan konfigurasi angka berpusat supaya boleh dilaras tanpa mengubah data akaun secara tidak adil.

### 10.2 Dompet vs Tabung

- Dua baki berasingan: `wallet_tokens`, `university_savings_tokens`.
- Ganjaran aktiviti dikreditkan ke **dompet**, bukan tabung (melainkan tetapan yang diminta kemudian).
- **Bank Impian**: deposit `wallet → savings`, withdraw `savings → wallet`, kedua-duanya manual, boleh ulang, jumlah integer >0 dan ≤ baki sumber.
- **Kedai Token**: semua pembelian potong **dompet sahaja**. Jika tidak cukup, paparkan “Token dompet tidak mencukupi. Pergi ke Bank Impian untuk pengeluaran.” **Tidak** keluarkan wang tabung secara automatik.
- **UPSI:** setelah pemain memilih daftar dan baki simpanan ≥1,500, potong **1,500 token dari tabung**, bukan dompet, dan tetapkan `university_success=true` secara sekali sahaja.
- Tiada wang sebenar, tiada transaksi berbayar luar aplikasi, tiada perjudian.

### 10.3 Kedai Token

| Item | Kategori | Fungsi | Harga CADANGAN |
|---|---|---|---:|
| Petunjuk tambahan | Power-up | Membimbing menjawab soalan bos | 15 |
| Perisai Tatabahasa | Power-up | Lindung satu kehilangan nyawa | 30 |
| Pemulihan nyawa | Power-up | +1 nyawa, maksimum 3 | 40 |
| Topi/pakaian biasa | Kosmetik | Tukar rupa Amir mengikut aset yang disediakan kemudian | belum ditetapkan |
| Item koleksi/pet | Koleksi | Barang koleksi tanpa kesan pembelajaran wajib | belum ditetapkan |

**Penting:** Reka bentuk pakaian Amir/Aisyah asal **kekal sebagai default**. Pilihan ganjaran khas kerana memulihkan Buku Misteri ialah **lencana**, bukan pakaian eksklusif. Kosmetik kedai ialah ciri **lain** yang masih dibenarkan.

### 10.4 Beg RPG Interaktif

Grid ikon item (contoh 4 kolum pada telefon landskap, lebih banyak pada desktop), boleh diskrol, petak baharu muncul apabila perlu; tanpa had slot. Item sama ditindan dengan jumlah, tunjuk tooltip/namanya, boleh memakai kosmetik dan melihat koleksi. Power-up digunakan melalui **butang pantas** dalam bos, bukan grid inventori. Buku Misteri dan lencana disimpan di **butang buku** dan **profil** secara berasingan.

### 10.5 Imbangan dan keselamatan transaksi

- Semua tambah/tolak token diproses **di pelayan / transaksi pangkalan data** secara atomik, bukan percaya nilai dihantar klien.
- `transaction_id` unik untuk `quest_reward`, `boss_reward`, `side_quest_reward`, `purchase`, `deposit`, `withdraw`, `university_payment`.
- Elak dua kali ganjaran akibat klik berganda, dua tab atau sambungan terputus; tidak boleh baki negatif.
- Tiada bayaran untuk pendaftaran UPSI sebenar; 1,500 token ialah mata permainan semata-mata.


## 11. Profil, lencana, buku ajaib dan UI permainan

### 11.1 Profil pemain

Mengandungi nama akaun/nama watak Amir, tahap semasa, bilangan misi utama (`x/25`), bilangan bos (`x/5`), token dompet, tabung universiti (`x/1500`), status tamat cerita, koleksi lencana dan **peratus penguasaan terkumpul (hanya di sini)**. Lencana belum diperoleh dipaparkan sebagai siluet terkunci; klik membuka syaratnya.

**Cadangan lencana (nama/syarat boleh dilaras):** Langkah Pertama (misi pertama), Wira Kampung (bos tahap 1), Penakluk Bos (5 bos), Bijak Kata Nafi (20 jawapan betul), Penyimpan Bijak (deposit pernah mencapai 500), Impian Tercapai (UPSI) dan **Wira Tatabahasa** (5 halaman dipulihkan). Jangan berikan lencana yang sama berkali-kali.

### 11.2 Buku Tatabahasa Misteri (butang khusus `B`)

Isi 4 tab di dalam satu paparan buku: `Nota Kata Nafi`, `Jurnal Misi`, `Halaman Misteri (0–5/5)`, `Pencapaian Pengembaraan` (ringkasan, **lencana sebenar tetap di profil**). Buku boleh diakses semasa penerokaan, tidak menggantikan inventori. Bila 5 halaman lengkap, mainkan efek pemulihan dan buka **Lencana Wira Tatabahasa**. Buku bukan portal; portal/peta/laluan rahsia di luar buku.

### 11.3 HUD penerokaan landskap

- Atas kiri: logo TAK BSN, tahap semasa, XP jika sistem prototaip sedia ada mahu dikekalkan, dompet token, objektif misi ringkas.
- Atas kanan: `Misi`, `Buku`, `Peta`, `Profil`, `Beg`, `Menu`, `Tugasan`.
- Tengah: peta top-down, Amir/Aisyah dan NPC/objek dengan `!` untuk tugas yang tersedia, kompas kecil.
- Telefon landskap: joystick kiri bawah, butang **AKSI/E** kanan bawah, ikon menu tidak terlindung oleh takuk/peramban; komputer: WASD/anak panah untuk gerak, `E` interaksi, `B` buku, `M` peta, `Esc` menu.
- **Peratus penguasaan tidak dipaparkan dalam HUD** (pilihan pengguna).

### 11.4 Panel dialog / mini-game

- Dialog utama: potret ekspresif + nama watak + teks **muncul serta-merta**, butang **Seterusnya**, pilihan **Terima Misi / Tolak Misi**, pilihan `Langkau` untuk dialog pernah dibaca.
- Dialog spontan: gelembung kecil di atas kepala NPC/Aisyah.
- Mini-game biasa: overlay pop-up dengan dunia tetap sebagai latar redup, fokus navigasi jelas, butang tutup/kembali sesuai, mengunci pergerakan semasa aktif.
- Bos: transisi sinematik ke paparan pertarungan; HUD bos memaparkan **3 nyawa, nombor soalan, nama bos, butang Petunjuk Aisyah (1), butang power-up pantas dan soalan**. Bar HP boleh menjadi **visual progres soalan** sahaja, supaya syarat menang kekal “selesaikan semua soalan”.
- Laporan mini-game: nyatakan keputusan item dan penerangan; sembunyikan peratus penguasaan keseluruhan (dalam profil sahaja).

### 11.5 Audio dinamik (tanpa suara)

| Keadaan | Arah audio |
|---|---|
| Kampung hub | Muzik tenang/ceria |
| Sekolah | Muzik ringan pembelajaran |
| Hutan | Bunyi alam + tema misteri |
| Istana | Tema cabaran / keagungan |
| Arena | Tema dramatik buku ajaib |
| Bos | Variasi muzik pertarungan mengikut tahap |
| Betul / salah | Kesan bunyi pendek lembut, tidak memalukan |
| Token / halaman pulih / lencana / UPSI | Bunyi ganjaran, ajaib dan kemenangan |

Sediakan kawalan `muzik`, `kesan bunyi`, `mute`, dan `reduce motion` (cadangan aksesibiliti). Audio dimulakan selepas interaksi pengguna kerana sekatan autoplay pelayar. **Tiada rakaman suara**.


## 12. Akaun, penyimpanan merentas peranti & Dashboard Guru

### 12.1 Akaun

**DISAHKAN:** pendaftaran/login boleh menggunakan `nama pengguna + kata laluan` **atau** Google. Simpan data awan supaya kemajuan boleh dibuka pada peranti lain. Akaun murid dan guru mempunyai peranan berasingan.

**CADANGAN keselamatan:** nama pengguna tidak memerlukan nama sebenar; e-mel Google mesti melalui OAuth rasmi dan hanya gunakan skop asas yang diperlukan; guru mendaftarkan kelas/kod kelas; jangan simpan kata laluan jelas atau token OAuth dalam GitHub. Jika murid adalah bawah umur, gunakan reka bentuk minimisasi data, panduan sekolah/penjaga yang sesuai dan kawalan akses ketat. Jangan dedahkan profil murid kepada orang awam atau murid lain secara lalai.

### 12.2 Data kemajuan yang perlu disimpan

- Profil: `player_id`, `display_name`, `role`, `avatar_style`, `settings`.
- Dunia: `current_area`, `spawn_point`, `highest_unlocked_stage`, `world_1_magic_triggered`, `five_pages_restored`, `university_success`.
- Misi: `quest_id`, `status`, `accepted_at`, `completed_at`, `reward_claimed_at`, `tracked_quest_id`, `attempt_id`.
- Bos: `boss_id`, `won_at`, `free_hint_used`, `battle_runs`, `questions_order_snapshot`, `reward_claimed_at`.
- Ekonomi: `wallet_tokens`, `university_savings_tokens`, ledger audit `transaction_id`, `item_id`, `quantity`, `type`, `created_at`.
- Item dan kosmetik: `inventory`, `equipped_cosmetics`.
- Soalan: setiap `answer_submission` (`question_id`, `attempt_id`, `submitted_answer`, `is_correct`, `used_paid_item`, `used_aisyah_hint`, `timestamp`).
- Guru: `class_id`, `teacher_id`, `join_code`, `student_membership`, `assignment`, `assignment_questions`, `submission`.

### 12.3 Dashboard Guru (DISAHKAN fungsi)

1. **Cipta/urus kelas** dan kod jemputan; senarai murid dengan nama samaran yang dibenarkan.
2. **Pantau kemajuan** peringkat 1–5, 25 misi dan 5 bos.
3. **Analisis penggunaan kata nafi**: jumlah jawapan, ketepatan terkumpul, pola salah *tidak/bukan*, percubaan semula dan penggunaan petunjuk.
4. **Bina latihan tambahan** (MCQ, isi tempat kosong, susun perkataan, padanan dan pembetulan kesalahan), beri kepada kelas/individu dan tentukan tempoh (cadangan).
5. **Rekod keputusan & eksport** laporan untuk evidens pembelajaran dan sokongan pertimbangan PBD; **jangan automatik menetapkan Tahap Penguasaan PBD**.
6. Tugasan yang dihantar dari dashboard muncul **serentak** dalam `Menu Tugasan` dan pada `NPC Encik Nazhif` di sekolah (satu rekod, bukan dua latihan salinan).

### 12.4 Sempadan hak akses

- `student`: hanya boleh baca/kemas kini kemajuan diri, tugasan kelasnya, profilnya.
- `teacher`: hanya kelas dan murid yang diberi kebenaran; tidak boleh melihat akaun kelas lain.
- `admin` (jika ada): pengurusan kandungan/sistem; **tiada pentadbir awam**.
- Semua perubahan role/kelas/reward/tabung mesti disahkan di backend; semua API dilindungi kawalan akses dan had kadar munasabah.

### 12.5 Cadangan struktur data

| Jadual / entiti | Kunci contoh | Tujuan |
|---|---|---|
| `users` + `profiles` | `user_id` | identiti, role, nama samaran |
| `world_progress` | `user_id` | tahap, tempat spawn, halaman, status UPSI |
| `quests` | `quest_id` | kandungan 25 misi tetap / side |
| `quest_progress` | `user_id,quest_id` | terima/selesai/ganjaran sekali |
| `boss_progress` | `user_id,boss_id` | kemenangan/halaman/attempt |
| `question_bank` | `question_id` | data 173 contoh + bank tambahan |
| `answer_submissions` | `submission_id` | audit jawapan semua cubaan |
| `wallets` | `user_id` | baki dompet dan tabung |
| `token_ledger` | `transaction_id` | sejarah transaksi idempoten |
| `inventory_items` | `user_id,item_id` | kuantiti/equip |
| `badges` / `user_badges` | `badge_id`, `user_id` | kriteria dan pencapaian |
| `classes` / `class_members` | `class_id,user_id` | hubungan murid-guru |
| `assignments` / `assignment_submissions` | `assignment_id` | latihan tambahan dan keputusan |

**Teknologi CADANGAN untuk GitHub/Claude Code:** TypeScript + React untuk skrin/menu, Phaser untuk peta 2D top-down dan input; backend berautentikasi seperti Supabase/Postgres atau API setara untuk simpanan merentas peranti serta OAuth Google. **Catatan penting:** sistem “nama pengguna + kata laluan” memerlukan aliran pengesahan backend yang selamat; penyedia OAuth mungkin menggunakan e-mel dalaman, jadi jangan samakan nama samaran dengan mekanik e-mel jika spesifikasi plugin tidak menyokong login nama pengguna secara terus. Gunakan backend tersahkan, bcrypt/argon2 (atau servis auth rasmi), sesi selamat dan polisi RLS. Jangan letak `service_role`/API rahsia dalam klien atau repositori awam.


## 13. Spesifikasi pembangunan untuk Claude Code & GitHub

### 13.1 Struktur projek CADANGAN

```text
TAK_BSN_PROJECT/
├── TAK_BSN_GAME_DESIGN.md        # dokumen ini
├── data/
│   └── TAK_BSN_SOALAN_173.json   # contoh bank 173 soalan berstruktur
├── assets/
│   ├── watak/                    # helaian konsep asal
│   ├── npc/
│   ├── boss/
│   ├── latar/
│   └── rujukan/
└── docs/
    └── KATALOG_GRAFIK_ASAL.md   # arkib rujukan asal
```

**Repositori aplikasi kelak** (cadangan): `src/game`, `src/components`, `src/features/auth`, `src/features/teacher`, `src/features/economy`, `src/features/quests`, `src/data`, `src/audio`, `src/styles`, `server/` atau `supabase/migrations`, `tests/`. Fail grafik kekal di `public/assets` atau disalin melalui pipeline aset yang mengingati atribusi/nama asal.

### 13.2 Komponen/scene wajib

`LandingMenu`, `LoginRegister`, `PlayerSetup`, `PrologueCutscene`, `WorldHubScene`, `Stage1..5Scenes`, `NPCDialogue`, `QuestOfferModal`, `QuestJournal`, `MagicBook`, `QuestMinigame`, `BossBattleScene`, `MapTravel`, `Compass`, `InventoryBackpack`, `TokenShop`, `DreamBank`, `PlayerProfile`, `AssignmentMenu`, `TeacherDashboard`, `UPSIRegistrationScene`, `UPSICutscene`, `PostGameContinue`.

**Perihal pemindahan aset:** PNG helaian konsep bukan spritesheet tersusun atau peta berlapis. Claude Code perlu membina **tilemap/collision/interaksi** yang boleh dimainkan, dan memotong sprite dengan tepat daripada helaian hanya jika sesuai; jika tidak boleh diasingkan dengan bersih, sediakan sprite baharu **berdasarkan rujukan pengguna**, bukan menggantikan seni secara rawak. Latar sekolah penuh dan UPSI ialah aset **belum ada**.

### 13.3 Susunan kerja supaya projek realistik

1. **Audit prototaip / import grafik**: semak komponen yang sudah ada di Canva/rekod; simpan salinan projek dan tetapkan resolusi input.
2. **Core RPG**: skrin landskap, kawalan komputer/telefon, Amir+Aisyah ikut automatik, collision, interaksi NPC, peralihan peta.
3. **Kandungan Tahap 1**: prolog, Perpustakaan Lama, kampung normal → ajaib, 5 misi, 5 soalan/misi, bos1 dan halaman pertama.
4. **Tahap 2–5**: peta penuh sekolah baharu, lima dunia, 25 misi + 5 bos, nota dan bank 173 soalan.
5. **Ekonomi/profil**: akaun, cloud save, dompet, tabung 1,500, kedai, beg, power-up, lencana, peratus profil.
6. **Guru**: kelas, Google/nama pengguna, latihan tambahan, dashboard, rekod kesalahan; sahkan perlindungan data.
7. **UPSI**: aset kampus+NPC pendaftaran+varian dewasa, transaksi token, lompatan masa, cutscene, postgame.
8. **Ujian penuh** pada telefon landskap/komputer dengan pemulihan sambungan; deployment & dokumentasi GitHub.

### 13.4 Contoh kontrak soalan (sepadan JSON)

```json
{
  "id": "S1-M1-Q1",
  "stage": 1,
  "owner_id": "S1-M1",
  "kind": "mcq",
  "prompt": "Amir ___ membaca buku di rumah.",
  "correct_answer": "tidak",
  "display_options": ["tidak", "bukan"],
  "canonical_sentence": "Amir tidak membaca buku di rumah.",
  "grammar_rule": "frasa_kerja_atau_adjektif",
  "explanation": "'Membaca' ialah frasa kerja; gunakan 'tidak' dalam konteks penafian biasa."
}
```

**Nota:** contoh di atas menunjukkan bentuk data, tidak semestinya sama dengan ayat pertama dalam bank data. Pastikan ID dalam `TAK_BSN_SOALAN_173.json` menjadi sumber tunggal; jangan gandakan soalan pada komponen UI.

### 13.5 Peristiwa & ciri penting untuk ujian automatik

- Menolak misi tidak memulakan misi dan tidak memotong token.
- Menerima misi 1,3,5,2,4 dalam sebarang urutan tetap membuka bos selepas kelimanya selesai.
- Pertarungan bos salah sekali → nyawa 2, soalan masih sama; cuba salah sehingga 0 → kalah; mula semula 3 nyawa & set soalan sama.
- Menggunakan 1 power-up berbayar pada soalan 2 melarang penggunaan kedua pada soalan 2, tetapi petunjuk Aisyah masih boleh digunakan; soalan 3 membenarkan power-up baharu.
- Bos dimenangi dua kali → **hadiah token dan halaman hanya sekali**.
- Membeli perisai memotong dompet sahaja; tidak boleh membeli dengan baki dompet 0 walaupun tabung 1,500.
- Deposit 200 dari dompet 300 → 100/200; pengeluaran 100 → 200/100; tidak boleh baki negatif.
- Papar pilihan daftar hanya jika `savings ≥ 1500`, tidak memerlukan ujian/sijil. Pendaftaran menolak 1,500 **tepat sekali**, menyimpan kejayaan, membenarkan meneroka selepas tamat.
- Pemulihan buku 5 halaman memberikan **lencana** sahaja (tiada pakaian eksklusif akibat pemulihan).
- 10 submission benar + 5 salah = 66.67% pada profil, tidak terpapar di HUD; guru hanya melihat murid dalam kelasnya.
- Log masuk pada peranti kedua memulihkan tahap/misi/tabung/item/kejayaan UPSI yang sama.
- Semua dialog paparan serta-merta, tiada suara, muzik boleh mute, UI tidak terpotong pada landscape telefon.

### 13.6 Kriteria penerimaan tugasan / demo

- Prolog sampai UPSI boleh dimainkan **end to end** dengan kawalan sentuh dan papan kekunci.
- 25 misi × 5 soalan, lima bos dengan 5/7/9/12/15 soalan, halaman dan unlock berfungsi.
- Sekurang-kurangnya satu latar kampung, sekolah penuh, hutan, istana, arena, kampus UPSI berfungsi sebagai scene interaktif/sinematik, bukan set gambar statik semata-mata.
- Semua nama NPC dan bos konsisten dengan katalog grafik; **semua murid Tingkatan 2**.
- Ada akaun murid/guru, hasil tugasan guru, simpanan awan dan pembatasan akses (untuk demo akaun ujian berbeza dan tiada data sebenar murid).
- Tiada wang sebenar, tiada tuntutan rasmi kemasukan universiti, tiada kelayakan PBD automatik.
- `README.md` GitHub menerangkan pemasangan, environment variable, aset, kelayakan demo dan semakan data; *jangan komit rahsia atau akaun murid sebenar*.


## 14. Kesilapan yang perlu dielakkan & perkara belum disahkan

| Isu | Keputusan / arahan |
|---|---|
| “Amir/Aisyah Tingkatan 5” tertulis pada PNG lama | **Salah** menurut pembetulan pengguna: **Tingkatan 2**. Kekalkan rupa/pakaian remaja asal; betulkan label yang boleh diedit. |
| Nama bos pertama “Si Keliru” vs “Kekeliruan Nafi” | Gunakan **nama poster grafik** untuk tajuk, alias boleh disebut dalam dialog sahaja jika mahu. |
| Perpustakaan Lama dan Bank Impian tidak jelas pada latar terkini | Jangan dakwa sudah tersedia sebagai objek interaktif; bina lokasi/pintu sebagai kerja pembangunan. |
| Sekolah Misteri, UPSI | **Peta penuh sekolah belum ada; kampus UPSI dan varian dewasa belum ada** dalam ZIP. Perlukan seni/peta baharu berasaskan gaya sama. |
| Bos 3 nyawa dan 15 soalan mungkin sangat susah | Uji dengan murid; jangan ubah had tanpa persetujuan, tetapi kuatkan tutorial dan maklum balas. |
| Dapat 1,500 token lebih awal daripada tahap 5 | **Jangan tambah syarat sijil/bos** pada pendaftaran. Beri pilihan daftar dan peluang kembali siapkan buku. |
| Implikasi lompatan masa | Amir asal tetap Tingkatan 2; pendaftaran digambarkan berlaku **beberapa tahun kemudian**. Mod pascacerita kembali kepada dunia pengembaraan untuk replay. |
| Kadar ganjaran/harga | Nilai 10/20/30/40/50, bonus bos dan harga 15/30/40 ialah **cadangan**, sasaran **1,500** ialah keputusan rasmi. |
| Jumlah misi aktif serentak | **Belum dipilih pengguna. Cadangan:** izinkan 5 aktif serentak, kompas jejak satu. |
| Masa bos tahap 2 | **Belum diputuskan. Cadangan:** 30–45 saat per soalan, gagal masa = kehilangan satu nyawa + ulang soalan yang sama. |
| “Semua jawapan” dalam peratus | Kira **setiap submission termasuk ulangan**; tidak automatik membuktikan Tahap Penguasaan PBD. |
| Butang power-up | Setiap **soalan** maksimum satu power-up berbayar; petunjuk Aisyah **berasingan**. |
| Lencana vs pakaian | Pilihan terakhir ganjaran buku ialah **Lencana Penguasaan**, bukan pakaian eksklusif. |
| Logo UPSI | Perlu semakan hak penggunaan dan label “simulasi pendidikan”, jangan dakwa sokongan rasmi. |
| Peranti / akaun murid | Reka bentuk selamat dan minimakan data peribadi; maklumat profil/kelas tidak awam. |
| Tahap 5 sudah tamat tetapi belum cukup token | Misi sampingan boleh diulang, ganjaran konsisten; jangan sekat kemasukan secara tidak adil. |

## 15. Sumber dan arkib

**Sumber utama daripada pengguna (asal dan dipelihara dalam pakej ini):**

1. ZIP `TAK_BSN_Koleksi_Grafik_Lengkap.zip` → 13 PNG + katalog Markdown. Semua fail PNG asal disalin **tanpa suntingan** di bawah folder `assets/`.
2. Rakaman prototaip laman Canva `https://takbsn.my.canva.site/dahz9gcjsjg` (pemerhatian semasa perbincangan) — skrin mula “Misi Kata Nafi”, bandar/hub top-down, NPC dan interaksi, joystick mudah alih, menu dan kedai. Ia sumber **perbandingan UX**, bukan fail kod sumber.
3. Semua keputusan pengguna dalam perbincangan reka bentuk sehingga pengesahan **lompatan masa sebelum masuk UPSI**.

**Sumber luar untuk semakan fakta (bukan bahan grafik permainan):**

- UPSI — kampus rasmi: https://www.upsi.edu.my/campus/
- UPSI — warisan dan maklumat universiti: https://www.upsi.edu.my/warisan/?lang=ms
- DBP/PRPM — kata nafi `tidak` / `bukan` dan maksud pertentangan: https://prpm.dbp.gov.my/Cari1?d=175768&keyword=bukan

**Hak dan atribusi:** Gunakan hanya aset ciptaan/yang anda berhak gunakan. Gambar dalam `assets/rujukan/` adalah **rujukan**, bukan lesen automatik untuk edaran awam. Jangan memaparkan logo universiti sebenar secara rasmi tanpa menyemak keizinan.

---

## Lampiran A — Semua 173 soalan utama untuk spesifikasi permainan

> Lampiran ini mengandungi **soalan contoh kandungan** yang dibina untuk menyiapkan spesifikasi. Ia bukan set soalan yang pernah dipersetujui satu persatu oleh pengguna. Perlu **semakan pedagogi dan bahasa** sebelum digunakan untuk penilaian rasmi. Fail `data/TAK_BSN_SOALAN_173.json` ialah versi berstruktur bagi pembangun.


### A.1 — Kampung Permulaan

**`S1-M1` — Papan Tanda Pelik (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S1-M1-Q1` | mcq | Amir ___ membaca buku di rumah. | **tidak** | Amir tidak membaca buku di rumah. |
| `S1-M1-Q2` | fill | Amir ___ seorang guru. | **bukan** | Amir bukan seorang guru. |
| `S1-M1-Q3` | mcq | Aisyah ___ lewat ke sekolah hari ini. | **tidak** | Aisyah tidak lewat ke sekolah hari ini. |
| `S1-M1-Q4` | matching | Aisyah ___ pegawai perpustakaan. | **bukan** | Aisyah bukan pegawai perpustakaan. |
| `S1-M1-Q5` | fill | Razin ___ menutup kedai pada waktu pagi. | **tidak** | Razin tidak menutup kedai pada waktu pagi. |

**`S1-M2` — Pesanan Razin (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S1-M2-Q1` | mcq | Izhan ___ membawa payung ke kios. | **tidak** | Izhan tidak membawa payung ke kios. |
| `S1-M2-Q2` | fill | Bangunan itu ___ sekolah baharu. | **bukan** | Bangunan itu bukan sekolah baharu. |
| `S1-M2-Q3` | mcq | Kelvin ___ menggunakan komputer itu. | **tidak** | Kelvin tidak menggunakan komputer itu. |
| `S1-M2-Q4` | matching | Buku ini ___ milik Razin. | **bukan** | Buku ini bukan milik Razin. |
| `S1-M2-Q5` | fill | Hazim ___ memetik bunga di taman. | **tidak** | Hazim tidak memetik bunga di taman. |

**`S1-M3` — Stok Kios Izhan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S1-M3-Q1` | mcq | Encik Nazhif ___ mengajar pada hari Ahad. | **tidak** | Encik Nazhif tidak mengajar pada hari Ahad. |
| `S1-M3-Q2` | fill | Beg di atas meja ___ kepunyaan Amir. | **bukan** | Beg di atas meja bukan kepunyaan Amir. |
| `S1-M3-Q3` | mcq | Murid itu ___ menyiapkan latihan. | **tidak** | Murid itu tidak menyiapkan latihan. |
| `S1-M3-Q4` | matching | Izhan ___ pengawas sekolah. | **bukan** | Izhan bukan pengawas sekolah. |
| `S1-M3-Q5` | fill | Kakak Amir ___ berjalan ke pasar. | **tidak** | Kakak Amir tidak berjalan ke pasar. |

**`S1-M4` — Jejak Taman Hazim (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S1-M4-Q1` | mcq | Bas sekolah ___ berhenti di hadapan pintu. | **tidak** | Bas sekolah tidak berhenti di hadapan pintu. |
| `S1-M4-Q2` | fill | Kelvin ___ pengetua sekolah. | **bukan** | Kelvin bukan pengetua sekolah. |
| `S1-M4-Q3` | mcq | Pintu perpustakaan ___ terbuka sekarang. | **tidak** | Pintu perpustakaan tidak terbuka sekarang. |
| `S1-M4-Q4` | matching | Hazim ___ pekerja di pasar itu. | **bukan** | Hazim bukan pekerja di pasar itu. |
| `S1-M4-Q5` | fill | Aisyah ___ memahami arahan itu. | **tidak** | Aisyah tidak memahami arahan itu. |

**`S1-M5` — Rak Perpustakaan Lama (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S1-M5-Q1` | mcq | Amir ___ berlari di koridor sekolah. | **tidak** | Amir tidak berlari di koridor sekolah. |
| `S1-M5-Q2` | fill | Haiwan kecil itu ___ kucing. | **bukan** | Haiwan kecil itu bukan kucing. |
| `S1-M5-Q3` | mcq | Komputer di makmal ___ berfungsi. | **tidak** | Komputer di makmal tidak berfungsi. |
| `S1-M5-Q4` | matching | Kawasan ini ___ taman permainan. | **bukan** | Kawasan ini bukan taman permainan. |
| `S1-M5-Q5` | fill | Razin ___ menerima bungkusan semalam. | **tidak** | Razin tidak menerima bungkusan semalam. |

**`S1-B` — Kekeliruan Nafi (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S1-B-Q1` | mcq | Bintang di langit ___ kelihatan malam ini. | **tidak** | Bintang di langit tidak kelihatan malam ini. |
| `S1-B-Q2` | mcq | Makanan di meja ___ sarapan Amir. | **bukan** | Makanan di meja bukan sarapan Amir. |
| `S1-B-Q3` | mcq | Kucing di taman ___ tidur di bawah pokok. | **tidak** | Kucing di taman tidak tidur di bawah pokok. |
| `S1-B-Q4` | mcq | Perpustakaan lama ___ bangunan kosong. | **bukan** | Perpustakaan lama bukan bangunan kosong. |
| `S1-B-Q5` | mcq | Murid baharu ___ mengenali semua guru. | **tidak** | Murid baharu tidak mengenali semua guru. |


### A.2 — Sekolah Misteri

**`S2-M1` — Nota Encik Nazhif (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S2-M1-Q1` | fill | Rumah di hujung jalan ___ rumah Aisyah. | **bukan** | Rumah di hujung jalan bukan rumah Aisyah. |
| `S2-M1-Q2` | mcq | Izhan ___ menjual buku latihan di kios. | **tidak** | Izhan tidak menjual buku latihan di kios. |
| `S2-M1-Q3` | matching | Buku misteri itu ___ buku masakan. | **bukan** | Buku misteri itu bukan buku masakan. |
| `S2-M1-Q4` | fill | Hazim ___ menyiram pokok itu. | **tidak** | Hazim tidak menyiram pokok itu. |
| `S2-M1-Q5` | mcq | Kedai itu ___ sebuah restoran. | **bukan** | Kedai itu bukan sebuah restoran. |

**`S2-M2` — Papan Kenyataan Misteri (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S2-M2-Q1` | fill | Bangunan besar itu ___ hospital. | **bukan** | Bangunan besar itu bukan hospital. |
| `S2-M2-Q2` | mcq | Pelajar itu ___ menghadiri perjumpaan. | **tidak** | Pelajar itu tidak menghadiri perjumpaan. |
| `S2-M2-Q3` | matching | Amir ___ ketua kumpulan tersebut. | **bukan** | Amir bukan ketua kumpulan tersebut. |
| `S2-M2-Q4` | fill | Buku di rak ___ tersusun kemas. | **tidak** | Buku di rak tidak tersusun kemas. |
| `S2-M2-Q5` | mcq | Jawapan ini ___ jawapan yang betul. | **bukan** | Jawapan ini bukan jawapan yang betul. |

**`S2-M3` — Kod Kelvin (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S2-M3-Q1` | fill | Benda bercahaya itu ___ lampu suluh. | **bukan** | Benda bercahaya itu bukan lampu suluh. |
| `S2-M3-Q2` | mcq | Papan tanda itu ___ jelas dibaca. | **tidak** | Papan tanda itu tidak jelas dibaca. |
| `S2-M3-Q3` | matching | Razin ___ penjual pakaian. | **bukan** | Razin bukan penjual pakaian. |
| `S2-M3-Q4` | fill | Soalan ini ___ sukar bagi Amir. | **tidak** | Soalan ini tidak sukar bagi Amir. |
| `S2-M3-Q5` | mcq | Izhan ___ jurulatih bola sepak. | **bukan** | Izhan bukan jurulatih bola sepak. |

**`S2-M4` — Buku Pinjaman (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S2-M4-Q1` | fill | Kelvin ___ pemilik perpustakaan lama. | **bukan** | Kelvin bukan pemilik perpustakaan lama. |
| `S2-M4-Q2` | mcq | Jalan di kampung ___ sesak pagi ini. | **tidak** | Jalan di kampung tidak sesak pagi ini. |
| `S2-M4-Q3` | matching | Hazim ___ guru Matematik. | **bukan** | Hazim bukan guru Matematik. |
| `S2-M4-Q4` | fill | Aisyah ___ penat selepas berehat. | **tidak** | Aisyah tidak penat selepas berehat. |
| `S2-M4-Q5` | mcq | Laluan ini ___ ke sekolah. | **bukan** | Laluan ini bukan ke sekolah. |

**`S2-M5` — Dialog Rakan Kelas (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S2-M5-Q1` | fill | Hadiah itu ___ untuk Amir. | **bukan** | Hadiah itu bukan untuk Amir. |
| `S2-M5-Q2` | mcq | Cuaca hari ini ___ panas. | **tidak** | Cuaca hari ini tidak panas. |
| `S2-M5-Q3` | matching | Bilik ini ___ bilik makmal. | **bukan** | Bilik ini bukan bilik makmal. |
| `S2-M5-Q4` | fill | Halaman buku itu ___ lengkap lagi. | **tidak** | Halaman buku itu tidak lengkap lagi. |
| `S2-M5-Q5` | mcq | Kotak itu ___ daripada kayu. | **bukan** | Kotak itu bukan daripada kayu. |

**`S2-B` — Buku Tidak Gramatis (7 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S2-B-Q1` | mcq | Kamera itu ___ kepunyaan kelas kami. | **bukan** | Kamera itu bukan kepunyaan kelas kami. |
| `S2-B-Q2` | mcq | Aisyah ___ membawa kamus mini. | **tidak** | Aisyah tidak membawa kamus mini. |
| `S2-B-Q3` | mcq | Kain ini ___ untuk membuat langsir. | **bukan** | Kain ini bukan untuk membuat langsir. |
| `S2-B-Q4` | mcq | Amir ___ menyalin nota daripada buku. | **tidak** | Amir tidak menyalin nota daripada buku. |
| `S2-B-Q5` | mcq | Bilik itu ___ untuk guru sahaja. | **bukan** | Bilik itu bukan untuk guru sahaja. |
| `S2-B-Q6` | mcq | Penjaga sekolah ___ membuka pagar. | **tidak** | Penjaga sekolah tidak membuka pagar. |
| `S2-B-Q7` | mcq | Kad ini ___ kad pelajar UPSI. | **bukan** | Kad ini bukan kad pelajar UPSI. |


### A.3 — Hutan Bahasa

**`S3-M1` — Jejak Perkataan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S3-M1-Q1` | reorder | gerbang / membuka / dapat / tidak / Mereka | **Mereka tidak dapat membuka gerbang.** | Mereka tidak dapat membuka gerbang. |
| `S3-M1-Q2` | reorder | sekolah / pihak / daripada / bukan / itu / Surat | **Surat itu bukan daripada pihak sekolah.** | Surat itu bukan daripada pihak sekolah. |
| `S3-M1-Q3` | reorder | berkunci / tidak / istana / Pintu | **Pintu istana tidak berkunci.** | Pintu istana tidak berkunci. |
| `S3-M1-Q4` | reorder | permainan / membeli / untuk / bukan / tabung / dalam / Duit | **Duit dalam tabung bukan untuk membeli permainan.** | Duit dalam tabung bukan untuk membeli permainan. |
| `S3-M1-Q5` | reorder | hujan / selepas / jernih / tidak / sungai / Air | **Air sungai tidak jernih selepas hujan.** | Air sungai tidak jernih selepas hujan. |

**`S3-M2` — Jambatan Ayat (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S3-M2-Q1` | reorder | tadi / petang / pada / bersih / tidak / itu / Taman | **Taman itu tidak bersih pada petang tadi.** | Taman itu tidak bersih pada petang tadi. |
| `S3-M2-Q2` | reorder | kampung / penduduk / milik / bukan / itu / Kawasan | **Kawasan itu bukan milik penduduk kampung.** | Kawasan itu bukan milik penduduk kampung. |
| `S3-M2-Q3` | reorder | perpustakaan / di / bising / tidak / Murid-murid | **Murid-murid tidak bising di perpustakaan.** | Murid-murid tidak bising di perpustakaan. |
| `S3-M2-Q4` | reorder | Aisyah / untuk / bukan / tersebut / Makanan | **Makanan tersebut bukan untuk Aisyah.** | Makanan tersebut bukan untuk Aisyah. |
| `S3-M2-Q5` | reorder | itu / lama / mesin / membaiki / pandai / tidak / Kelvin | **Kelvin tidak pandai membaiki mesin lama itu.** | Kelvin tidak pandai membaiki mesin lama itu. |

**`S3-M3` — Cendawan Nafi (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S3-M3-Q1` | reorder | baharu / pesanan / tentang / yakin / tidak / Razin | **Razin tidak yakin tentang pesanan baharu.** | Razin tidak yakin tentang pesanan baharu. |
| `S3-M3-Q2` | reorder | kami / sekolah / bendera / bukan / itu / Bendera | **Bendera itu bukan bendera sekolah kami.** | Bendera itu bukan bendera sekolah kami. |
| `S3-M3-Q3` | reorder | berat / tidak / itu / Peti | **Peti itu tidak berat.** | Peti itu tidak berat. |
| `S3-M3-Q4` | reorder | utama / jalan / bukan / ini / Jambatan | **Jambatan ini bukan jalan utama.** | Jambatan ini bukan jalan utama. |
| `S3-M3-Q5` | reorder | gelap / tidak / malam / Langit | **Langit malam tidak gelap.** | Langit malam tidak gelap. |

**`S3-M4` — Pokok Ingatan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S3-M4-Q1` | reorder | semula / mencuba / takut / tidak / Amir | **Amir tidak takut mencuba semula.** | Amir tidak takut mencuba semula. |
| `S3-M4-Q2` | reorder | istana / masuk / pintu / bukan / ini / Gerbang | **Gerbang ini bukan pintu masuk istana.** | Gerbang ini bukan pintu masuk istana. |
| `S3-M4-Q3` | reorder | jawapan / memberikan / ragu-ragu / tidak / Aisyah | **Aisyah tidak ragu-ragu memberikan jawapan.** | Aisyah tidak ragu-ragu memberikan jawapan. |
| `S3-M4-Q4` | reorder | murid / menunggu / tempat / bukan / itu / Ruang | **Ruang itu bukan tempat menunggu murid.** | Ruang itu bukan tempat menunggu murid. |
| `S3-M4-Q5` | reorder | muridnya / kepada / marah / tidak / itu / Guru | **Guru itu tidak marah kepada muridnya.** | Guru itu tidak marah kepada muridnya. |

**`S3-M5` — Gerbang Sunyi (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S3-M5-Q1` | reorder | dilalui / selamat / tidak / ini / Laluan | **Laluan ini tidak selamat dilalui.** | Laluan ini tidak selamat dilalui. |
| `S3-M5-Q2` | reorder | jualan / barang / bukan / itu / Lencana | **Lencana itu bukan barang jualan.** | Lencana itu bukan barang jualan. |
| `S3-M5-Q3` | reorder | difahami / mudah / tidak / arah / Tanda | **Tanda arah tidak mudah difahami.** | Tanda arah tidak mudah difahami. |
| `S3-M5-Q4` | reorder | sekolah / lama / gambar / bukan / ini / Gambar | **Gambar ini bukan gambar lama sekolah.** | Gambar ini bukan gambar lama sekolah. |
| `S3-M5-Q5` | reorder | kuat / tidak / itu / loceng / Bunyi | **Bunyi loceng itu tidak kuat.** | Bunyi loceng itu tidak kuat. |

**`S3-B` — Pengacau Susunan Ayat (9 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S3-B-Q1` | reorder | abjad / mengikut / buku / menyusun / tidak / Razin | **Razin tidak menyusun buku mengikut abjad.** | Razin tidak menyusun buku mengikut abjad. |
| `S3-B-Q2` | reorder | sukan / pertandingan / hadiah / bukan / itu / Pingat | **Pingat itu bukan hadiah pertandingan sukan.** | Pingat itu bukan hadiah pertandingan sukan. |
| `S3-B-Q3` | reorder | pelanggan / kepada / baki / memulangkan / tidak / Izhan | **Izhan tidak memulangkan baki kepada pelanggan.** | Izhan tidak memulangkan baki kepada pelanggan. |
| `S3-B-Q4` | reorder | sekolah / uniform / bukan / itu / Pakaian | **Pakaian itu bukan uniform sekolah.** | Pakaian itu bukan uniform sekolah. |
| `S3-B-Q5` | reorder | projektor / menghidupkan / tidak / Kelvin | **Kelvin tidak menghidupkan projektor.** | Kelvin tidak menghidupkan projektor. |
| `S3-B-Q6` | reorder | pasar / ke / jalan / bukan / ini / Jalan | **Jalan ini bukan jalan ke pasar.** | Jalan ini bukan jalan ke pasar. |
| `S3-B-Q7` | reorder | arah / papan / memasang / tidak / Hazim | **Hazim tidak memasang papan arah.** | Hazim tidak memasang papan arah. |
| `S3-B-Q8` | reorder | sirap / air / bukan / botol / dalam / di / Air | **Air di dalam botol bukan air sirap.** | Air di dalam botol bukan air sirap. |
| `S3-B-Q9` | reorder | terjatuh / selepas / cantik / tidak / itu / bunga / Pasu | **Pasu bunga itu tidak cantik selepas terjatuh.** | Pasu bunga itu tidak cantik selepas terjatuh. |


### A.4 — Istana Tatabahasa

**`S4-M1` — Gerbang Kesalahan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S4-M1-Q1` | correction | Buku itu bukan menarik bagi semua murid. | **tidak** | Buku itu tidak menarik bagi semua murid. |
| `S4-M1-Q2` | correction | Kristal itu tidak batu biasa. | **bukan** | Kristal itu bukan batu biasa. |
| `S4-M1-Q3` | correction | Perpustakaan bukan sunyi semasa rehat. | **tidak** | Perpustakaan tidak sunyi semasa rehat. |
| `S4-M1-Q4` | correction | Peta itu tidak peta dunia sebenar. | **bukan** | Peta itu bukan peta dunia sebenar. |
| `S4-M1-Q5` | correction | Amir bukan lupa membawa buku latihan. | **tidak** | Amir tidak lupa membawa buku latihan. |

**`S4-M2` — Taman Perintah (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S4-M2-Q1` | correction | Aisyah bukan menjumpai pintu rahsia. | **tidak** | Aisyah tidak menjumpai pintu rahsia. |
| `S4-M2-Q2` | correction | Soalan itu tidak teka-teki matematik. | **bukan** | Soalan itu bukan teka-teki matematik. |
| `S4-M2-Q3` | correction | Razin bukan mencatat semua harga. | **tidak** | Razin tidak mencatat semua harga. |
| `S4-M2-Q4` | correction | Kertas di lantai tidak surat rasmi. | **bukan** | Kertas di lantai bukan surat rasmi. |
| `S4-M2-Q5` | correction | Izhan bukan membungkus barang dengan cepat. | **tidak** | Izhan tidak membungkus barang dengan cepat. |

**`S4-M3` — Arkib Berdebu (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S4-M3-Q1` | correction | Kelvin bukan menyimpan fail itu. | **tidak** | Kelvin tidak menyimpan fail itu. |
| `S4-M3-Q2` | correction | Halaman ini tidak bahagian penutup buku. | **bukan** | Halaman ini bukan bahagian penutup buku. |
| `S4-M3-Q3` | correction | Hazim bukan memeriksa jambatan. | **tidak** | Hazim tidak memeriksa jambatan. |
| `S4-M3-Q4` | correction | Kunci ini tidak kunci rumah saya. | **bukan** | Kunci ini bukan kunci rumah saya. |
| `S4-M3-Q5` | correction | Encik Nazhif bukan memulakan kelas lagi. | **tidak** | Encik Nazhif tidak memulakan kelas lagi. |

**`S4-M4` — Air Pancut Pertentangan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S4-M4-Q1` | mcq | Amir ___ hendak bermain, tetapi hendak belajar. | **bukan** | Amir bukan hendak bermain, tetapi hendak belajar. |
| `S4-M4-Q2` | mcq | Aisyah ___ malas, tetapi sedang kurang sihat. | **bukan** | Aisyah bukan malas, tetapi sedang kurang sihat. |
| `S4-M4-Q3` | mcq | Razin ___ ingin menutup kedai, tetapi ingin menyusun stok dahulu. | **bukan** | Razin bukan ingin menutup kedai, tetapi ingin menyusun stok dahulu. |
| `S4-M4-Q4` | mcq | Izhan ___ marah, tetapi hanya kecewa. | **bukan** | Izhan bukan marah, tetapi hanya kecewa. |
| `S4-M4-Q5` | mcq | Kelvin ___ mahu memadam fail, tetapi mahu menyimpannya. | **bukan** | Kelvin bukan mahu memadam fail, tetapi mahu menyimpannya. |

**`S4-M5` — Balairung Betul Salah (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S4-M5-Q1` | correction | Murid itu bukan mengangkat tangan. | **tidak** | Murid itu tidak mengangkat tangan. |
| `S4-M5-Q2` | correction | Hadiah itu tidak milik Kelvin. | **bukan** | Hadiah itu bukan milik Kelvin. |
| `S4-M5-Q3` | correction | Aisyah bukan menulis jawapan di papan putih. | **tidak** | Aisyah tidak menulis jawapan di papan putih. |
| `S4-M5-Q4` | correction | Bangunan di hadapan tidak pusat membeli-belah. | **bukan** | Bangunan di hadapan bukan pusat membeli-belah. |
| `S4-M5-Q5` | correction | Amir bukan mendengar arahan dengan teliti. | **tidak** | Amir tidak mendengar arahan dengan teliti. |

**`S4-B` — Benteng Kesalahan Nafi (12 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S4-B-Q1` | correction | Jalan menuju perpustakaan bukan jauh. | **tidak** | Jalan menuju perpustakaan tidak jauh. |
| `S4-B-Q2` | correction | Bunga itu tidak bunga ros. | **bukan** | Bunga itu bukan bunga ros. |
| `S4-B-Q3` | correction | Peraturan ini bukan rumit. | **tidak** | Peraturan ini tidak rumit. |
| `S4-B-Q4` | correction | Topi itu tidak topi Razin. | **bukan** | Topi itu bukan topi Razin. |
| `S4-B-Q5` | correction | Penerangan Aisyah bukan panjang. | **tidak** | Penerangan Aisyah tidak panjang. |
| `S4-B-Q6` | correction | Tempat ini tidak kawasan rehat. | **bukan** | Tempat ini bukan kawasan rehat. |
| `S4-B-Q7` | correction | Rak buku itu bukan teguh. | **tidak** | Rak buku itu tidak teguh. |
| `S4-B-Q8` | correction | Kotak kecil itu tidak peti harta. | **bukan** | Kotak kecil itu bukan peti harta. |
| `S4-B-Q9` | correction | Hujan bukan berhenti sejak pagi. | **tidak** | Hujan tidak berhenti sejak pagi. |
| `S4-B-Q10` | correction | Papan kenyataan itu tidak untuk iklan kedai. | **bukan** | Papan kenyataan itu bukan untuk iklan kedai. |
| `S4-B-Q11` | correction | Semua murid bukan faham penjelasan tersebut. | **tidak** | Semua murid tidak faham penjelasan tersebut. |
| `S4-B-Q12` | correction | Kesilapan itu tidak kesalahan ejaan. | **bukan** | Kesilapan itu bukan kesalahan ejaan. |


### A.5 — Arena Penguasaan

**`S5-M1` — Lingkaran Nama (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S5-M1-Q1` | mcq | Hazim ___ hendak berehat, tetapi hendak menyiapkan kerja. | **bukan** | Hazim bukan hendak berehat, tetapi hendak menyiapkan kerja. |
| `S5-M1-Q2` | reorder | lampu / suis / menutup / tidak / mereka / Rakan | **Rakan mereka tidak menutup suis lampu.** | Rakan mereka tidak menutup suis lampu. |
| `S5-M1-Q3` | correction | Amir tidak seorang mahasiswa lagi. | **bukan** | Amir bukan seorang mahasiswa lagi. |
| `S5-M1-Q4` | fill | Encik Nazhif ___ tidak memahami murid, tetapi sedang memberi mereka masa. | **bukan** | Encik Nazhif bukan tidak memahami murid, tetapi sedang memberi mereka masa. |
| `S5-M1-Q5` | matching | Guru besar ___ hadir ke perhimpunan. | **tidak** | Guru besar tidak hadir ke perhimpunan. |

**`S5-M2` — Kristal Perbuatan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S5-M2-Q1` | mcq | Jambatan itu ___ lemah, tetapi belum dibaiki dengan betul. | **bukan** | Jambatan itu bukan lemah, tetapi belum dibaiki dengan betul. |
| `S5-M2-Q2` | reorder | menyala / tidak / koridor / Lampu | **Lampu koridor tidak menyala.** | Lampu koridor tidak menyala. |
| `S5-M2-Q3` | correction | Aisyah tidak penjaga kedai runcit. | **bukan** | Aisyah bukan penjaga kedai runcit. |
| `S5-M2-Q4` | fill | Amir ___ lupa, tetapi sengaja menunggu Aisyah. | **bukan** | Amir bukan lupa, tetapi sengaja menunggu Aisyah. |
| `S5-M2-Q5` | matching | Kertas latihan ___ kering selepas terkena air. | **tidak** | Kertas latihan tidak kering selepas terkena air. |

**`S5-M3` — Cermin Sifat (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S5-M3-Q1` | mcq | Buku itu ___ rosak sepenuhnya, tetapi hanya beberapa halamannya tercabut. | **bukan** | Buku itu bukan rosak sepenuhnya, tetapi hanya beberapa halamannya tercabut. |
| `S5-M3-Q2` | reorder | tepat / tidak / itu / Penyelesaian | **Penyelesaian itu tidak tepat.** | Penyelesaian itu tidak tepat. |
| `S5-M3-Q3` | correction | Buku itu tidak kepunyaan Encik Nazhif. | **bukan** | Buku itu bukan kepunyaan Encik Nazhif. |
| `S5-M3-Q4` | fill | Aisyah ___ takut, tetapi sedang memikirkan jawapan. | **bukan** | Aisyah bukan takut, tetapi sedang memikirkan jawapan. |
| `S5-M3-Q5` | matching | Jawapan pelajar ___ lengkap. | **tidak** | Jawapan pelajar tidak lengkap. |

**`S5-M4` — Jejak Pertentangan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S5-M4-Q1` | mcq | Tugas itu ___ mudah, tetapi boleh diselesaikan dengan latihan. | **bukan** | Tugas itu bukan mudah, tetapi boleh diselesaikan dengan latihan. |
| `S5-M4-Q2` | reorder | tinggi / tidak / gerbang / Pintu | **Pintu gerbang tidak tinggi.** | Pintu gerbang tidak tinggi. |
| `S5-M4-Q3` | correction | Objek di tasik tidak sebuah bot. | **bukan** | Objek di tasik bukan sebuah bot. |
| `S5-M4-Q4` | fill | Jawapan itu ___ salah sepenuhnya, tetapi kurang tepat pada bahagian akhir. | **bukan** | Jawapan itu bukan salah sepenuhnya, tetapi kurang tepat pada bahagian akhir. |
| `S5-M4-Q5` | matching | Tempat duduk itu ___ selesa. | **tidak** | Tempat duduk itu tidak selesa. |

**`S5-M5` — Pentas Penguasaan (5 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S5-M5-Q1` | mcq | Kelvin ___ hendak keluar, tetapi mahu memeriksa projektor dahulu. | **bukan** | Kelvin bukan hendak keluar, tetapi mahu memeriksa projektor dahulu. |
| `S5-M5-Q2` | reorder | luas / tidak / makmal / Ruang | **Ruang makmal tidak luas.** | Ruang makmal tidak luas. |
| `S5-M5-Q3` | correction | Pokok itu tidak pokok mangga. | **bukan** | Pokok itu bukan pokok mangga. |
| `S5-M5-Q4` | fill | Amir ___ bertanya untuk mengusik, tetapi kerana mahu memahami peraturan. | **bukan** | Amir bukan bertanya untuk mengusik, tetapi kerana mahu memahami peraturan. |
| `S5-M5-Q5` | matching | Jambatan kayu ___ kukuh. | **tidak** | Jambatan kayu tidak kukuh. |

**`S5-B` — Penjaga Buku Tatabahasa (15 soalan)**

| ID | Format | Soalan / cip kata | Jawapan | Ayat rujukan |
|---|---|---|---|---|
| `S5-B-Q1` | fill | Amir ___ mahu berputus asa. | **tidak** | Amir tidak mahu berputus asa. |
| `S5-B-Q2` | reorder | bahaya / tanda / bukan / dinding / pada / Simbol | **Simbol pada dinding bukan tanda bahaya.** | Simbol pada dinding bukan tanda bahaya. |
| `S5-B-Q3` | correction | Aisyah bukan melangkah masuk ke bilik bacaan. | **tidak** | Aisyah tidak melangkah masuk ke bilik bacaan. |
| `S5-B-Q4` | mcq | Simpanan ini ___ untuk membeli telefon. | **bukan** | Simpanan ini bukan untuk membeli telefon. |
| `S5-B-Q5` | matching | Razin ___ menolak cadangan itu, tetapi mahu menelitinya semula. | **bukan** | Razin bukan menolak cadangan itu, tetapi mahu menelitinya semula. |
| `S5-B-Q6` | fill | Kelvin ___ menerima mesej itu lagi. | **tidak** | Kelvin tidak menerima mesej itu lagi. |
| `S5-B-Q7` | reorder | penjahat / watak / bukan / itu / Pemain | **Pemain itu bukan watak penjahat.** | Pemain itu bukan watak penjahat. |
| `S5-B-Q8` | correction | Hazim bukan membuang sampah ke dalam sungai. | **tidak** | Hazim tidak membuang sampah ke dalam sungai. |
| `S5-B-Q9` | mcq | Murid yang baru masuk ___ Amir. | **bukan** | Murid yang baru masuk bukan Amir. |
| `S5-B-Q10` | matching | Izhan ___ mahu menjual barang tersebut, tetapi mahu memulangkannya. | **bukan** | Izhan bukan mahu menjual barang tersebut, tetapi mahu memulangkannya. |
| `S5-B-Q11` | fill | Razin ___ menyukai susunan rak baharu. | **tidak** | Razin tidak menyukai susunan rak baharu. |
| `S5-B-Q12` | reorder | renang / kolam / bukan / itu / kecil / Tasik | **Tasik kecil itu bukan kolam renang.** | Tasik kecil itu bukan kolam renang. |
| `S5-B-Q13` | correction | Izhan bukan percaya kepada khabar angin itu. | **tidak** | Izhan tidak percaya kepada khabar angin itu. |
| `S5-B-Q14` | mcq | Barang di kios ___ milik sekolah. | **bukan** | Barang di kios bukan milik sekolah. |
| `S5-B-Q15` | matching | Hazim ___ sedang tidur, tetapi sedang memeriksa taman. | **bukan** | Hazim bukan sedang tidur, tetapi sedang memeriksa taman. |


**Nota lampiran:** Soalan format `reorder` menunjukkan cip kata terbalik sebagai representasi teks sahaja. Dalam permainan sebenar, cip dipersembahkan secara rawak yang boleh diseret/ditekan; ayat rujukan ialah satu susunan yang diterima. Untuk beberapa ayat, kemungkinan susunan tatabahasa alternatif perlu disemak guru sebelum penggredan automatik. Semua penjelasan dan kategori peraturan disediakan dalam JSON bagi setiap soalan.

**Tamat dokumen TAK BSN GDD v1.0.**

