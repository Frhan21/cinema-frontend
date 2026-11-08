# Cinema Motion Redesign

Status: ready-for-agent

## Summary

Redesign seluruh CineReserve menjadi pengalaman **Midnight Premiere**: dark cinematic, signal-red, media-led, mobile-first, dan memiliki motion bermakna pada setiap route. Produk mempertahankan nama CineReserve, menggunakan wordmark baru, Bricolage Grotesque untuk display, dan Manrope untuk UI.

## Settled decisions

- Audiens utama: penonton bioskop Indonesia yang terutama menggunakan ponsel.
- Scope: seluruh aplikasi—public discovery, detail, auth, booking, payment, tickets, dashboard, dan admin.
- Palet: near-black, warm white, Netflix-like red; tidak meniru logo Netflix.
- Hero: 5 film unggulan dari TMDB, auto slider, kontrol manual, trailer YouTube muted setelah jeda di desktop; mobile dan reduced-motion memakai backdrop statis.
- Motion: satu focal hero sequence, route continuity, section/list reveal bervariasi, control feedback, reduced-motion fallback.
- Verifikasi: ESLint + TypeScript/Vite build + browser smoke test desktop/mobile. Tidak menambah test framework.
- Delivery: lima tracer-bullet ticket berurutan.

## Design system

- Background `#070707`, surface `#141414`, primary `#E50914`, foreground `#F5F3EF`, muted foreground `#B3B3B3`.
- Display: Bricolage Grotesque 700–800. UI/body: Manrope 400–800.
- Controls memakai radius kompak 4px; poster/media sebagian besar square-cornered.
- Red hanya untuk primary action, progress aktif, selected state, dan emphasis penting.
- Essential text contrast minimal 4.5:1; focus ring selalu terlihat.

## Functional requirements

### Foundation and shell

- Token MUI, Tailwind, dan CSS konsisten.
- App shell memiliki wordmark baru, transparent-to-solid header, desktop/mobile search, active navigation, skip link, semantic footer, dan keyboard focus.
- Route transitions menggunakan AnimatePresence/Motion dan tetap usable tanpa motion.

### Discovery

- Home menampilkan hero carousel 5 film.
- Data film detail dipakai untuk trailer; kegagalan enrichment fallback ke summary tanpa menggagalkan hero.
- Slide aktif berganti otomatis dan dapat dipilih manual.
- Preview autoplay muted hanya desktop setelah 2.8 detik; tidak autoplay pada reduced motion.
- Search, loading, error, empty, movie cards, dan responsive layout tetap berfungsi.

### Booking journey

- Detail, seat selection, payment, dan payment status menggunakan visual system baru.
- Seat control mobile minimal 44×44px dan state tidak hanya mengandalkan warna.
- Dynamic selection/total/payment status diumumkan secara tepat.
- Sticky summary desktop memiliki alternatif mobile yang tidak menutupi konten.

### Account

- Auth, tickets, dashboard, dan not-found konsisten dengan sistem baru.
- Dashboard tidak boleh menampilkan identitas hard-coded ketika session data tersedia.
- Loading/error/empty tersedia untuk data akun dan watchlist.

### Admin

- Admin memakai versi restrained dari sistem yang sama.
- Tabel tetap usable di desktop dan memiliki representasi mobile yang masuk akal.
- Dialog, CRUD feedback, destructive action, loading, error, dan empty states konsisten.
- Motion admin melayani state/continuity, bukan spectacle.

## Accessibility and responsive requirements

- Keyboard navigation lengkap, visible focus, skip link, semantic headings dan labels.
- Touch target minimal 44×44px.
- `prefers-reduced-motion` mengurangi travel dan mematikan autoplay preview.
- Tidak ada horizontal overflow halaman pada 390px; overflow terkontrol untuk rail/table/seat map.
- Smoke test minimal pada desktop 1440px dan mobile 390px.

## Seam testing

Tidak menambah test runner. Setiap ticket diverifikasi dengan:

1. `npm run typecheck` saat iterasi.
2. `npm run lint`.
3. `npm run build`.
4. Browser smoke test pada route yang berubah di desktop dan mobile, termasuk keyboard/focus dan reduced-motion bila tooling tersedia.
5. Jika browser/Chrome tidak tersedia, blocker dicatat dan tidak mengklaim validasi visual penuh.

## Out of scope

- Perubahan backend/API contract.
- Meniru wordmark atau logo Netflix.
- Autoplay audio.
- Fitur watchlist backend baru.
- Menambah test framework dalam task ini.
