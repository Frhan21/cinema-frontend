# Director and cast details

Status: resolved

## What to build

Perluas TMDB credits mapping dan halaman detail untuk menampilkan director serta maksimal delapan aktor utama, lengkap dengan foto, nama, karakter, dan fallback profile.

## Blocked by

- 01-single-genre-filter

## Acceptance criteria

- [ ] TMDB credit types mencakup profile path dan cast character/order.
- [ ] Domain Movie membawa director detail dan cast list tanpa merusak consumer lama.
- [ ] Detail menampilkan director dan maksimal delapan aktor.
- [ ] Foto TMDB menggunakan URL profile yang benar dan lazy loading.
- [ ] Missing photo memiliki fallback initial/name yang accessible.
- [ ] Mobile dan desktop mempertahankan hierarchy serta tidak overflow.
- [ ] Lint dan build lulus.

## Comments

Selesai: TMDB credits typing dan domain mapping diperluas untuk director profile dan delapan cast berdasarkan order. Detail film menampilkan director card, horizontal cast rail, profile photo, character, accessible alt, lazy loading, dan initial fallback. Trailer juga memakai lazy loading serta referrer policy. Lint, build, dan detector lulus; browser smoke tetap terblokir karena Chrome/Browser Use tidak tersedia.
