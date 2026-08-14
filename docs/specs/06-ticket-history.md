# Feature: Ticket History

## Goal

User dapat melihat transaksi pending, paid, dan cancelled miliknya.

## API

- `GET ticket/history`
- `GET transaction/{transaction_id}` untuk detail/status terbaru.

## Acceptance Criteria

- Pending dipisahkan dari completed/cancelled.
- Status memakai label dan warna, bukan warna saja.
- Setiap item menampilkan total, waktu, transaction UUID, dan CTA relevan.
- Pending membuka halaman continue payment.
- Empty state menjelaskan mengapa daftar kosong.

## Limitation

History contract saat ini hanya berisi ringkasan transaction. Detail movie/seat harus diambil dari transaction items setelah backend menetapkan struktur item yang stabil.
