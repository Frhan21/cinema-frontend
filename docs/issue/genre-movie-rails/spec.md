# Genre Movie Rails

Status: ready-for-agent

## Summary

Ubah area discovery landing page menjadi horizontal movie rails. “Sedang tayang” tidak lagi berupa grid statis, melainkan slider yang dapat digeser. Tambahkan lima section genre dinamis menggunakan TMDB Discover agar pengguna dapat menemukan film di luar daftar now-playing.

## Settled decisions

- Sumber genre menggunakan TMDB `/discover/movie`, bukan hanya pengelompokan daftar now-playing.
- Landing page menampilkan lima genre populer yang memiliki konten.
- Rail mendukung swipe/drag di mobile, trackpad/wheel horizontal, scroll-snap, dan tombol panah desktop.
- Search results tetap menggunakan grid agar hasil pencarian mudah dipindai.
- Verifikasi memakai lint, build, dan browser smoke test jika tooling tersedia; tidak menambah test runner.

## Data requirements

- Service dapat mengambil daftar genre TMDB dan daftar film berdasarkan `genreId`.
- Query Discover menggunakan `language=id-ID`, `region=ID`, `include_adult=false`, urutan popularitas, dan page pertama.
- Film hasil Discover dipetakan ke domain `Movie` menggunakan mapper yang sama dengan now-playing.
- Landing memilih lima genre prioritas yang tersedia dari TMDB dan mengabaikan rail tanpa film.
- Kegagalan satu genre tidak boleh menggagalkan rail lain atau seluruh landing page.

## UI requirements

- Buat reusable `MovieRail` dengan heading, optional description, previous/next controls, dan horizontal snap track.
- Card memiliki lebar responsif yang stabil sehingga sebagian card berikutnya terlihat sebagai affordance swipe.
- Panah disembunyikan jika track tidak overflow atau sudah berada di batas arah terkait.
- Drag menggunakan native scrolling/pointer behavior tanpa mengorbankan aktivasi link.
- Rail “Sedang tayang” menggunakan seluruh daftar now-playing yang tersedia.
- Lima genre dirender setelah rail sedang tayang dan sebelum editorial closing section.
- Loading menggunakan skeleton rail; error per genre dapat di-retry atau dilewati tanpa menutupi rail lain.
- Reduced motion menghindari smooth animated scrolling tetapi tetap memindahkan track.

## Accessibility

- Setiap rail memiliki heading yang terhubung ke region.
- Tombol panah memiliki accessible label yang menyebut nama rail.
- Track dapat digunakan keyboard dan fokus card terlihat.
- Scroll tidak menjebak keyboard atau halaman.
- Tidak ada informasi penting yang hanya tersedia saat hover.

## Responsive behavior

- Mobile: swipe native, poster width sekitar 42–48vw dengan partial next card.
- Tablet: sekitar 3–4 card terlihat.
- Desktop: sekitar 5–6 card terlihat dan tombol panah tersedia.
- Search state tetap menggunakan responsive grid.

## Seam verification

1. `npm run typecheck` selama implementasi.
2. `npm run lint`.
3. `npm run build`.
4. Browser smoke test 1440px dan 390px jika browser tooling tersedia.
5. Jika browser tidak tersedia, blocker dicatat dan tidak mengklaim validasi visual penuh.
