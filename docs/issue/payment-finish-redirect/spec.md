# Spec: Payment Finish Redirect

## Goal

Pengguna yang kembali dari Midtrans Snap dialihkan ke halaman status transaksi yang benar. Tanpa mengubah cinema-ticketing-api.

## Alur

1. `POST /transaction/:id/pay` → redirect browser ke `redirect_url` (Midtrans Snap).
2. Midtrans mengembalikan browser ke `<frontend-origin>/payment/finish?order_id=cinema-<uuid>&status_code=...&transaction_status=...`.
3. `/payment/finish` memvalidasi `order_id` (prefix `cinema-` + UUID valid), lalu `navigate('/payment/status/<uuid>', { replace: true })`.
4. Halaman status (sudah ada) mengambil status dari `GET /transaction/:id`; polling hanya saat `pending`.

## Accepted

- Konfigurasi Finish Redirect URL Midtrans menjadi route statis `/payment/finish` (`src/App.tsx` baru menerima route ini).
- `order_id` dari query dipakai untuk mengenali transaksi lokal (backend memakai prefix `cinema-<transaction_uuid>`).
- `transaction_status` / `status_code` dari browser tidak dijadikan bukti pembayaran; satu-satunya status adalah backend.
- Callback `order_id` tidak valid / hilang → error aman tanpa request API; CTA ke `/tickets` untuk pemulihan.
- Navigasi sukses memakai `replace` agar query string Midtrans tidak tertinggal di history.

## Non-goals

- Mengubah proyek Go (`cinema-ticketing-api`), konfigurasi Midtrans, atau endpoint backend.
- Menambah test runner baru (repo belum punya); verifikasi via typecheck + lint + build + smoke test.
