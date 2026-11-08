# CineReserve Design System

## Direction

CineReserve uses a **midnight premiere** visual world: film imagery leads, controls stay direct, and transitions feel like clean cuts between reels. It is cinematic without neon, ornamental glass, or excessive glow.

## Color tokens

- `--background` / cinema: `#070707`
- `--surface`: `#141414`
- primary action / active: `#E50914`
- primary text: `#F5F3EF`
- secondary text: `#B3B3B3`
- success, warning, info, and destructive colors are semantic and must not replace the brand accent.

Red is reserved for primary actions, active progress, selection, and urgent brand emphasis. Film artwork supplies the broader color range.

## Typography

- Display and wordmark: **Bricolage Grotesque**, weight 700–800, tracking no tighter than `-0.04em`.
- Body, navigation, forms, tables, and controls: **Manrope**, weight 400–800.
- Monospace is limited to true identifiers such as booking and transaction codes.

## Shape and depth

Controls use a compact 4px radius. Posters and major media are predominantly square-cornered. Resting surfaces use tonal separation instead of shadows. Shadows are limited to floating menus, dialogs, and actively elevated interactions.

## Motion

- Micro feedback: 120–180ms.
- Routine state changes: 180–300ms.
- Page and content entrances: 420–580ms using `cubic-bezier(.16,1,.3,1)`.
- Hero carousel: masked/crossfade cut, metadata shift, and timed progress.
- Desktop hero trailer begins muted after a short delay; mobile and reduced-motion users retain a static backdrop.
- Every motion path must remain legible under `prefers-reduced-motion`.

## Layout

Public discovery favors full-bleed media, poster rails, and section-scale fields. Operational screens use restrained panels and stronger information density. Mobile touch targets are at least 44×44px, and sticky summaries must not obscure content.

## Accessibility

Visible focus is white with offset against dark surfaces. Essential text must meet 4.5:1 contrast. Dynamic loading and transaction state changes use appropriate live-region semantics. Status is never communicated by color alone.
