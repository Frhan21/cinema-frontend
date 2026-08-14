# Feature: Schedules and Seats

## Goal

User memilih jadwal yang dibuat admin lalu memilih kursi yang tersedia untuk schedule tersebut.

## API

- Public: `GET schedule/movie/tmdb/{tmdb_id}`
- Auth: `GET seat/studio/{studio_id}`
- Auth: `GET ticket/available-seats/{schedule_id}`

## Data Composition

1. Detail TMDB memberikan integer `tmdb_id`.
2. Backend memberikan schedule, studio, waktu, dan harga.
3. Master seat studio digabung dengan available seat IDs.
4. Seat yang tidak muncul pada endpoint available dianggap occupied untuk schedule tersebut.

## Acceptance Criteria

- Waktu selalu ditampilkan dalam timezone Asia/Jakarta.
- Maksimal delapan kursi dapat dipilih pada UI.
- Occupied seat disabled dan tidak dapat dipilih dengan keyboard.
- Selected seat memiliki `aria-pressed=true` dan label row/number.
- Harga preview dihitung dari `schedule.price × selected seats`.
- Master `is_available` tidak dianggap sebagai availability per schedule tanpa cross-check endpoint ticket.

## Edge Cases

- Schedule dihapus saat user membuka halaman: tampilkan session unavailable.
- Seat baru saja dipesan user lain: booking API menjadi validasi final dan error ditampilkan.
- Tidak ada schedule: CTA booking disabled dengan empty state informatif.
