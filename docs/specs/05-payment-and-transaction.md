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
4. Setelah kembali, Midtrans mengarahkan browser ke `/payment/finish?order_id=cinema-<transaction-id>`. Halaman ini hanya memvalidasi format `order_id`, lalu replace-navigate ke `/payment/status/{transaction_id}`. `status_code` dan `transaction_status` dari query diabaikan.
5. Buka `/payment/status/{transaction_id}`.
6. Poll transaction setiap lima detik selama status `pending`.
7. Stop polling saat `paid` atau `cancelled`.

## Finish URL

Konfigurasi Midtrans Dashboard:

- Finish Redirect URL: `https://<frontend-host>/payment/finish` (Midtrans menambah `?order_id=cinema-<uuid>&status_code=...&transaction_status=...`).
- Payment Notification URL: tetap mengarah ke backend (`https://<public-api-host>/api/v1/payment/notification`), bukan ke frontend.

## Acceptance Criteria

- Frontend tidak meminta detail kartu atau memilih payment method.
- Endpoint pay dapat dipanggil ulang secara aman karena backend idempotent.
- Redirect/query dari Midtrans tidak dianggap bukti pembayaran.
- `order_id` return harus berformat `cinema-<UUID>`; format lain menampilkan error aman tanpa panggilan API.
- Pending menampilkan continue payment, refresh, dan cancel.
- Paid menampilkan CTA ke tickets.
- Cancelled menampilkan CTA booking ulang.
- Payment expiry ditentukan backend, default 15 menit.
