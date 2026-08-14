# Feature: Movie Discovery

## Goal

User dapat melihat now-playing, mencari film, dan membuka detail editorial dengan visual berkualitas tinggi.

## Data Sources

- TMDB `GET /movie/now_playing`
- TMDB `GET /search/movie`
- TMDB `GET /movie/{movie_id}` dengan `credits,videos,release_dates`
- Backend admin dapat mengimpor film melalui `POST movie/import` menggunakan `tmdb_id`.

## UI States

- Loading: skeleton poster grid.
- Success: hero, now-playing grid, dan detail.
- Empty search: saran memperpendek judul atau memeriksa ejaan.
- Error: pesan dan tombol retry.
- Missing image: fallback cinematic image.

## Acceptance Criteria

- Search di-debounce untuk menghindari request per keystroke.
- Poster below-fold memakai lazy loading.
- Rating TMDB 0–10 dipetakan menjadi tampilan 0–5.
- Detail menampilkan director, runtime, certification, trailer, dan tagline bila tersedia.
- TMDB attribution tampil pada footer.
- Tidak ada asumsi bahwa film TMDB otomatis sedang tayang di bioskop.
