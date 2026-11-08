# Redesign Surface Brief

## Scope and mode

Seluruh aplikasi CineReserve. Home dan detail berada pada mode Experience; booking, akun, pembayaran, tiket, dan admin berada pada mode Operate.

## Direction contract

**THESIS** — CineReserve menjadi “midnight premiere”: setiap layar terasa seperti perpindahan antar reel dalam satu pemutaran, bukan katalog streaming generik. Sistem menolak neon cyberpunk, panel glass berulang, dan grid kartu seragam sebagai struktur utama.

**OWN-WORLD** — Near-black `#070707`, warm white `#F5F3EF`, signal red `#E50914`, serta permukaan charcoal. Bricolage Grotesque membawa judul dan wordmark; Manrope membawa data dan kontrol. Gambar film adalah warna utama; merah hanya menandai aksi, posisi aktif, dan progres.

**STORY** — Pengguna menemukan beberapa film unggulan melalui hero slider, melihat trailer muted setelah jeda pada desktop, membuka detail, lalu bergerak ke jadwal, kursi, pembayaran, dan tiket tanpa kehilangan konteks.

**FIRST VIEWPORT** — Hero memenuhi layar di bawah navigasi transparan. Film aktif mengisi backdrop; judul dan metadata berada di kiri bawah, rail film unggulan berada di kanan bawah, dan progress bar tipis menunjukkan perpindahan slide. Trailer tidak menutupi keterbacaan konten.

**FORM** — Arah keempat dari daftar grounded: projection cue / midnight premiere. `seed:5f7cc944bf4103e4`.

**FINISH** — unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Motion thesis

- Focal moment: pergantian hero seperti cut antar reel—gambar melakukan masked crossfade, metadata bergeser pendek, dan progress di-reset.
- Continuity: transisi route, pergantian slide, drawer, modal trailer, dan state booking menjaga orientasi spasial.
- Feedback: kontrol bergerak 100–220 ms; list masuk dengan stagger terbatas; halaman masuk 420 ms.
- Budget: satu video YouTube muted hanya pada hero aktif desktop setelah jeda; mobile tetap memakai backdrop; reduced motion menghapus travel dan autoplay.
