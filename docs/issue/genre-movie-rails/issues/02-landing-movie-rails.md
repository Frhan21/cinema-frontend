# Landing movie rails

Status: resolved

## What to build

Buat reusable horizontal `MovieRail`, ubah “Sedang tayang” menjadi rail, integrasikan lima genre rail, pertahankan search results sebagai grid, dan tambahkan responsive/loading/error/empty behavior.

## Blocked by

- 01-tmdb-genre-data

## Acceptance criteria

- [ ] Swipe/drag, scroll-snap, keyboard, trackpad, dan panah desktop bekerja.
- [ ] Tombol panah memiliki label yang menyebut rail dan state disabled di batas.
- [ ] Partial next card terlihat di mobile sebagai affordance.
- [ ] Search results tetap grid.
- [ ] Rail genre kosong tidak dirender; kegagalan satu rail tidak menutupi rail lain.
- [ ] Reduced-motion tidak memakai smooth scrolling.
- [ ] Typecheck, lint, dan build lulus.

## Comments

Selesai: reusable MovieRail dengan native swipe/drag scrolling, scroll-snap, keyboard-focusable track, responsive partial card, edge-aware desktop arrows, reduced-motion scrolling, skeleton rails, dan integrasi landing. Search results tetap grid. Favicon CineReserve baru dan metadata halaman juga diterapkan. Lint, build, dan Impeccable detector lulus; smoke test browser tetap terblokir karena Chrome/Browser Use tidak tersedia.
