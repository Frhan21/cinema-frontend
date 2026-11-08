# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pengguna utama adalah penonton bioskop di Indonesia yang mencari film dan memesan tiket terutama melalui ponsel, dengan dukungan desktop untuk discovery dan pengelolaan akun.

## Product Purpose

CineReserve membantu pengguna menemukan film yang sedang tayang, melihat detail dan trailer, memilih jadwal serta kursi, menyelesaikan pembayaran, dan mengakses tiket digital dalam satu alur. Keberhasilan utama adalah pengguna dapat berpindah dari discovery ke tiket terkonfirmasi dengan cepat, jelas, dan tanpa kehilangan konteks pemesanan.

## Positioning

CineReserve menggabungkan discovery film berbasis data TMDB dengan inventori jadwal, kursi, booking, promo, pembayaran Midtrans, dan tiket dari Cinema Ticketing API. Integrasi kedua sistem menggunakan `tmdb_id` sebagai penghubung.

## Operating Context

Alur utama: Home/Discovery → Detail Film → Pilih Jadwal → Pilih Kursi → Tinjau Pesanan → Pembayaran → Status Pembayaran → Tiket. Pengguna juga dapat mencari film, membuka riwayat tiket, dan mengelola profil. Admin mengelola film, studio, kursi, jadwal, promo, dan laporan operasional.

## Capabilities and Constraints

- Frontend menggunakan React 19, TypeScript, Vite, Material UI, Tailwind CSS, Zustand, TanStack Query, Axios, dan Motion for React.
- TMDB menyediakan now-playing, pencarian, detail, gambar, kredit, sertifikasi, dan sumber trailer YouTube.
- Cinema Ticketing API memiliki ownership atas harga, diskon, jumlah pembayaran, identitas pengguna, status kursi, booking, dan transaksi.
- Redirect Midtrans bukan bukti pembayaran; status transaksi harus diverifikasi melalui backend.
- Route booking, payment, tickets, dashboard, dan admin memiliki proteksi akses sesuai peran.
- Semua tampilan aplikasi termasuk publik, booking, akun, dan admin termasuk dalam cakupan redesign.

## Brand Commitments

- Nama produk tetap **CineReserve**.
- Logo/wordmark akan didesain ulang.
- Palet utama mengikuti karakter Netflix: hitam sinematik, putih hangat, dan merah sebagai aksen utama, tanpa meniru logo Netflix.
- Pengalaman harus terasa sinematik, imersif, dan motion-rich, namun tetap efisien untuk booking lewat ponsel.
- Referensi visual yang diberikan menekankan hero film berskala besar, navigasi transparan, poster rail/slider, detail film editorial, dan transisi konten.

## Evidence on Hand

- Integrasi TMDB dan Cinema Ticketing API sudah tersedia di codebase.
- Screenshot dan HTML referensi awal tersedia di `stitch-reference/`.
- Tiga referensi visual tambahan diberikan pengguna di percakapan.
- Aset fallback lokal tersedia di `src/assets/hero.png`; gambar film aktual berasal dari TMDB.
- Tidak ada testimonial, angka pelanggan, atau klaim bisnis yang boleh direkayasa.

## Product Principles

- Prioritaskan discovery yang imersif tanpa memperlambat jalan menuju booking.
- Pertahankan konteks film, jadwal, kursi, dan transaksi sepanjang alur.
- Gunakan motion untuk orientasi, hierarki, dan feedback—bukan dekorasi yang menghambat.
- Rancang mobile-first dengan target sentuh yang aman, konten terbaca, dan state yang jelas.
- Data pembayaran dan ketersediaan kursi selalu mengikuti sumber backend.

## Accessibility & Inclusion

- Seluruh interaksi dapat digunakan dengan keyboard dan memiliki focus state yang terlihat.
- Target sentuh minimum 44×44 px.
- Kontras teks minimum 4.5:1 untuk teks normal.
- Status tidak hanya dibedakan melalui warna.
- Motion menghormati `prefers-reduced-motion`, dengan konten tetap tersedia tanpa animasi.
