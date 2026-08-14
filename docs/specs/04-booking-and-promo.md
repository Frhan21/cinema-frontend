# Feature: Booking and Promo

## Goal

User memvalidasi promo opsional dan membuat booking untuk satu schedule dengan satu atau lebih seat UUID.

## API

- `GET promo/validate/{code}?total_price=<subtotal>`
- `POST ticket/`

## Request Contract

```json
{
  "schedule_id": "uuid",
  "seat_id": ["seat-uuid"],
  "promo_code": "OPTIONAL"
}
```

## Acceptance Criteria

- Field kursi bernama `seat_id`, bukan `seat_ids`.
- Minimal satu seat dan tidak ada duplicate UUID.
- Frontend tidak mengirim `user_id`, harga final, gross amount, atau payment method.
- Promo diubah ke uppercase dan backend menjadi validator final.
- Double submission dicegah dengan loading/disabled state.
- `transaction_id` dari response disimpan untuk payment dan recovery.

## Failure Recovery

- 400: tampilkan payload/promo error yang dapat diperbaiki.
- 401: arahkan login.
- Seat conflict: kembali ke seat map dan refetch availability.
- 500: pertahankan selection agar user dapat retry.
