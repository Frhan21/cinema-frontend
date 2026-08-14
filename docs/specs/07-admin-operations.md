# Feature: Admin Operations

## Goal

Admin mengelola movie internal, import TMDB, studio, seat, schedule, promo, transaction, dan report.

## Typed Service

`src/services/admin-service.ts` menyediakan namespace:

- `movies`: list/get/create/import/update/remove
- `studios`: list/get/create/update/remove
- `seats`: list/byStudio/create/update/remove
- `schedules`: list/create/update/remove
- `promos`: list/create/update/remove
- `transactions`: list
- `reports`: daily/monthly

## Acceptance Criteria

- Seluruh admin route dilindungi role `admin`.
- Pagination memakai `page` dan `per_page` serta membaca `meta`.
- Harga dan capacity divalidasi sebagai integer positif.
- Schedule memakai format `YYYY-MM-DD HH:mm` dan future date.
- Seat update mengirim `id`, `studio_id`, `seat_number`, dan `is_available` lengkap.
- Description movie tidak dianggap berhasil diperbarui sampai backend issue diperbaiki.
- Delete membutuhkan confirmation dialog.

## Current UI Scope

Admin panel menyediakan tab responsif dengan CRUD forms berikut:

- **Overview:** daily revenue dan tickets sold dari report API.
- **Movies:** pagination, TMDB import untuk New Release, create manual, edit, delete.
- **Studios:** pagination, create, edit, delete.
- **Seats:** pagination, create, full-field update sesuai backend quirk, active switch, delete.
- **Schedules:** pagination, movie/studio selector, future Jakarta datetime, integer price, edit, delete.
- **Promos:** create/edit/delete, percentage validation, unlimited usage dengan nilai 0, RFC3339 date range.

Semua mutation menampilkan loading state, API error, confirmation delete, dan melakukan TanStack Query cache invalidation setelah sukses.

## Form Dependencies

1. Movie harus dibuat atau diimpor terlebih dahulu.
2. Studio harus dibuat sebelum seat.
3. Movie dan studio harus tersedia sebelum schedule.
4. Schedule overlap, end time, dan future-time tetap divalidasi final oleh backend.

## Known Backend Constraint

Update description movie belum diterapkan oleh handler backend. Form tetap menampilkan warning dan tidak menjanjikan bahwa perubahan description akan tersimpan.
