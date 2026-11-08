# Midtrans finish return handler

Status: resolved

## What to build

Tambahkan route publik `/payment/finish` yang membaca `order_id` dari query string Midtrans, memvalidasi format `cinema-<uuid>`, lalu melakukan replace navigation ke `/payment/status/<uuid>`. Input tidak valid menampilkan error aman tanpa memanggil API.

## Blocked by

- (tidak ada)

## API

- Midtrans mengirim `order_id`, `status_code`, `transaction_status` pada query finish URL.
- `GET /transaction/:transaction_id` (endpoint backend yang sudah ada) tetap sumber status pembayaran.

## Acceptance criteria

- [ ] `/payment/finish?order_id=cinema-<valid-uuid>` → redirect replace ke `/payment/status/<valid-uuid>` tanpa mempertahankan query Midtrans.
- [ ] `order_id` hilang, bukan prefix `cinema-`, atau UUID tidak valid → error aman + CTA `/tickets`, tanpa panggilan API dan tanpa redirect.
- [ ] `status_code` dan `transaction_status` tidak dipakai untuk memutuskan paid/cancelled.
- [ ] Route `/payment/status/:transactionId` tetap terproteksi `ProtectedRoute`.
- [ ] Doc `docs/specs/05-payment-and-transaction.md` dan `README.md` diperbarui.
- [x] `npm run typecheck`, `npm run lint`, dan `npm run build` lulus.

## Comments

Selesai: route publik `/payment/finish` (`src/pages/PaymentFinishPage.tsx`) memvalidasi `order_id` Midtrans (prefix `cinema-` + UUID v1–v5, case-insensitive), replace-navigate ke `/payment/status/<uuid>`. Input hilang/tidak valid → error aman + CTA `/tickets`, tanpa panggilan API. `status_code`/`transaction_status` diabaikan sepenuhnya. Doc spec 05 + README diperbarui (Finish URL & Notification URL). Typecheck/lint/build lulus; regex parser diverifikasi node self-check (valid, mixed-case, prefix salah, UUID salah panjang/version/nibble). Smoke test browser belum dijalankan (butuh manual deploy/local run).
