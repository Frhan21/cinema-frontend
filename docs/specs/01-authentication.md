# Feature: Authentication and Session

## Goal

User dapat register, login, mempertahankan session, melihat menu akun, dan logout. Navbar menampilkan tombol Login saat anonymous dan avatar/profile menu saat authenticated.

## API

- `POST auth/register`
- `POST auth/login`
- `GET user/profile`
- `PUT user/profile`

## State

- `anonymous`: tidak ada token/user.
- `authenticated`: token dan user tersedia.
- `expired`: API mengembalikan 401; session harus dihapus dan user diarahkan ke login.
- Role: `user | admin`.

## Acceptance Criteria

- Password minimal enam karakter dan konfirmasi harus sama.
- Token dikirim sebagai Bearer token untuk endpoint protected.
- Protected route menyimpan target route dan kembali ke sana setelah login.
- Admin route hanya dapat diakses user dengan role `admin`.
- Logout membersihkan token dan auth state.
- Navbar tidak menampilkan avatar palsu kepada anonymous user.

## Security Notes

Implementasi saat ini menyimpan JWT di local storage agar sesuai dengan SPA scaffold. Production sebaiknya menggunakan secure HttpOnly cookie bila backend mendukungnya. Jangan memasukkan role atau user ID ke request booking.
