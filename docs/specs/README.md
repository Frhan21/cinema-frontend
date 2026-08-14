# CineReserve Feature Specifications

Dokumentasi ini menjadi sumber spesifikasi frontend berbasis fitur. Setiap dokumen menjelaskan tujuan, kontrak API, state UI, acceptance criteria, dan edge cases.

## Feature Map

1. [Authentication and Session](./01-authentication.md)
2. [Movie Discovery](./02-movie-discovery.md)
3. [Schedules and Seats](./03-schedules-and-seats.md)
4. [Booking and Promo](./04-booking-and-promo.md)
5. [Payment and Transaction](./05-payment-and-transaction.md)
6. [Ticket History](./06-ticket-history.md)
7. [Admin Operations](./07-admin-operations.md)
8. [UI, Motion, and Accessibility](./08-ui-motion-accessibility.md)

## System Boundaries

- TMDB menyediakan discovery, pencarian, gambar, dan detail editorial film.
- Cinema Ticketing API menyediakan movie internal, schedule, seat availability, booking, promo, transaction, payment, ticket history, dan admin reports.
- `tmdb_id` menghubungkan detail TMDB dengan schedule backend.
- Backend adalah sumber kebenaran harga, diskon, seat availability, dan payment status.
- Frontend tidak menyimpan Midtrans server key atau menentukan gross amount.

## Shared API Rules

- Backend base: `https://cinema-ticketing-api.onrender.com/api/v1/`
- Semua resource ID internal berupa UUID string; `tmdb_id` berupa integer.
- Response sukses memakai `{ message, data }`; list paginated menambahkan `meta`.
- Backend saat ini dapat mengembalikan `data: null` untuk paginated list kosong; service frontend menormalisasinya menjadi array kosong.
- Error dinormalisasi menjadi `ApiClientError` dari `{ message, error }`.
- Endpoint auth memakai `Authorization: Bearer <token>`.
- Waktu schedule dibaca sebagai `Asia/Jakarta` dengan format `YYYY-MM-DD HH:mm`.
