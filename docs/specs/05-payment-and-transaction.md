# Feature: Payment and Transaction

## Goal

Booking pending diarahkan ke Midtrans dan status akhir selalu diverifikasi melalui backend.

## API

- `POST transaction/{transaction_id}/pay`
- `GET transaction/{transaction_id}`
- `POST transaction/{transaction_id}/cancel`

## Flow

1. Buat booking dan simpan `transaction_id`.
2. Panggil pay tanpa body.
3. Redirect browser ke `redirect_url`.
4. Setelah kembali, buka `/payment/status/{transaction_id}`.
5. Poll transaction setiap lima detik selama status `pending`.
6. Stop polling saat `paid` atau `cancelled`.

## Acceptance Criteria

- Frontend tidak meminta detail kartu atau memilih payment method.
- Endpoint pay dapat dipanggil ulang secara aman karena backend idempotent.
- Redirect/query dari Midtrans tidak dianggap bukti pembayaran.
- Pending menampilkan continue payment, refresh, dan cancel.
- Paid menampilkan CTA ke tickets.
- Cancelled menampilkan CTA booking ulang.
- Payment expiry ditentukan backend, default 15 menit.
