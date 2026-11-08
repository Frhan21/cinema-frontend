# TMDB genre discovery data

Status: resolved

## What to build

Tambahkan service dan query hooks untuk mengambil lima genre prioritas yang tersedia serta film populer per genre dari TMDB Discover. Kegagalan satu genre tidak boleh menggagalkan genre lain.

## Blocked by

None.

## Acceptance criteria

- [ ] Mapper film dipakai konsisten oleh now-playing dan discover.
- [ ] Discover memakai language Indonesia, region Indonesia, adult disabled, dan popularity order.
- [ ] Lima genre yang memiliki film dikembalikan sebagai collection terstruktur.
- [ ] Query memiliki cache/stale time yang wajar.
- [ ] Typecheck, lint, dan build lulus.

## Comments

Selesai: TMDB Discover ditambahkan untuk genre Action, Drama, Comedy, Horror, dan Animation menggunakan ID genre stabil, mapping domain bersama, `Promise.allSettled` untuk isolasi kegagalan, serta query cache 30 menit. Lint dan build lulus.
