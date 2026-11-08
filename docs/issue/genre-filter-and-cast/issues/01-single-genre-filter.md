# Single genre filter rail

Status: resolved

## What to build

Ganti banyak genre sections menjadi satu MovieRail dengan filter chips. Default now-playing; genre mengganti data rail menggunakan genre collection TMDB yang sudah tersedia.

## Blocked by

None.

## Acceptance criteria

- [ ] Hanya satu movie section genre yang dirender.
- [ ] Default “Sedang tayang” memakai now-playing.
- [ ] Lima chip genre memiliki active state dan `aria-pressed`.
- [ ] Pemilihan genre mengganti title, description, dan movie list pada rail yang sama.
- [ ] Loading/error genre tetap terlokalisasi pada section.
- [ ] Keyboard dan reduced-motion behavior tetap benar.
- [ ] Lint dan build lulus.

## Comments

Selesai: landing sekarang hanya memiliki satu MovieRail dengan chips Sedang Tayang, Action, Drama, Comedy, Horror, dan Animation. Active state memakai `aria-pressed`; default tidak membutuhkan request tambahan; genre mengganti data, heading, dan description pada rail yang sama. Lint, build, dan detector lulus.
