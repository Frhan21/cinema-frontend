# Feature: UI, Motion, and Accessibility

## Design Direction

Modern cinematic dark UI, content-first, dengan primary red, secondary electric blue, Montserrat display, dan Inter body. Source design rules tersimpan di `design-system/cinereserve/MASTER.md`.

## Motion Rules

- Library: Motion for React (`motion/react`, penerus Framer Motion).
- Page reveal: opacity + 12px vertical shift, 380ms.
- Section reveal: viewport-triggered, once only.
- Movie hover: elevation 5px tanpa mengubah surrounding layout.
- List stagger: 50ms per item.
- `MotionConfig reducedMotion="user"` menghormati OS reduced-motion.
- Tidak ada animasi penting lebih dari 500ms.

## Accessibility Acceptance Criteria

- Semua interactive targets minimal 44px.
- Keyboard focus terlihat jelas.
- Seat memakai button semantics, disabled state, label, dan pressed state.
- Form memiliki label, autocomplete, inline errors, dan loading state.
- Text body memenuhi contrast 4.5:1; secondary UI minimal 3:1.
- Status tidak disampaikan dengan warna saja.
- Layout diverifikasi pada 375px, 768px, 1024px, dan 1440px.
- Loading, error, empty, pending, paid, dan cancelled semuanya memiliki feedback eksplisit.

## Performance Acceptance Criteria

- Routes lazy-loaded.
- TMDB images below fold memakai `loading="lazy"`.
- TanStack Query menghindari request berulang dengan stale time.
- Search di-debounce.
- Animasi hanya memakai opacity/transform untuk menghindari layout thrashing.
