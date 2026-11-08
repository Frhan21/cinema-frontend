# Discovery and TMDB hero

Status: resolved

## What to build

Bangun home discovery dengan hero slider lima film, enrichment trailer TMDB yang resilient, muted delayed preview desktop, poster rail controls, search, responsive movie grid/rows, dan motion reveal yang terukur.

## Blocked by

- 01-foundation-shell

## Acceptance criteria

- [ ] Hero memakai sampai lima film now-playing dan fallback aman.
- [ ] Trailer muted dimulai setelah jeda hanya desktop; mobile/reduced-motion statis.
- [ ] Auto slide, previous/next, thumbnail selection, labels, dan progress bekerja.
- [ ] Search loading/error/empty tetap benar.
- [ ] Movie cards memiliki hover dan keyboard focus setara.
- [ ] Desktop 1440px dan mobile 390px tidak overflow.
- [ ] Lint dan build lulus.

## Comments

Selesai: TMDB featured enrichment, hero carousel lima film, controls, progress, delayed muted desktop preview, reduced-motion/mobile fallback, redesigned search, poster cards, dan content reveal. `npm run lint`, `npm run build`, dan Impeccable detector lulus. Browser smoke test desktop/mobile belum dapat dijalankan karena browser tooling tidak tersedia.
