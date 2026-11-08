# Foundation and app shell

Status: resolved

## What to build

Implementasikan token Midnight Premiere lintas MUI/Tailwind/CSS, tipografi Bricolage Grotesque + Manrope, wordmark CineReserve, shell responsive, route transition, focus styles, loading semantics, dan reduced-motion foundation.

## Blocked by

None.

## Acceptance criteria

- [ ] Warna/font konsisten di MUI, Tailwind, dan CSS.
- [ ] Header berubah transparent-to-solid dan mobile navigation/search lengkap.
- [ ] Skip link, main target, visible focus, dan footer semantic tersedia.
- [ ] Route transition tidak menghambat reduced-motion.
- [ ] Loading/skeleton state memiliki semantics yang tepat.
- [ ] Lint dan build lulus.

## Comments

Selesai: token visual, tipografi, route transition, responsive shell, skip link, focus treatment, loading semantics, DESIGN.md, dan design token artifact telah diterapkan. `npm run lint`, `npm run build`, dan Impeccable detector lulus. Browser smoke test belum dapat dijalankan karena executable Browser Use dan Chrome/Chromium tidak tersedia di environment.
