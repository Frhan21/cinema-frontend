# CineReserve Frontend

Type-safe movie reservation frontend based on the Google Stitch **CineFlow Movie Reservation** design.

## Stack

- React 19, TypeScript, Vite
- Material UI and Tailwind CSS
- Zustand for auth and booking state
- TanStack Query for API state
- Axios for HTTP transport
- Motion for React for accessible page, section, list, and card animation

## Data architecture

- **TMDB:** now-playing, search, movie details, images, credits, certification, trailer.
- **Cinema Ticketing API:** auth, schedules, studio seats, per-schedule availability, booking, promo, Midtrans checkout, transaction status, history, and admin operations.
- The integration key between the two systems is integer `tmdb_id`.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

```env
VITE_API_BASE_URL=https://cinema-ticketing-api.onrender.com/api/v1/
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
VITE_TMDB_READ_TOKEN=your_tmdb_api_read_access_token
```

## Application routes

| Route | Access | Screen |
| --- | --- | --- |
| `/` | Public | TMDB movie discovery and search |
| `/movies/:tmdbId` | Public | TMDB details + backend schedules |
| `/login` | Public | Login |
| `/register` | Public | Registration |
| `/booking/:tmdbId/:scheduleId` | User | Per-schedule seat selection |
| `/payment` | User | Promo and booking confirmation |
| `/payment/finish` | Public | Midtrans return handler (parses `order_id` → status page) |
| `/payment/status/:transactionId` | User | Midtrans/transaction status recovery |
| `/tickets` | User | Transaction history |
| `/dashboard` | User | Member dashboard |
| `/admin` | Admin | Admin dashboard |

Admin panel includes functional CRUD forms for TMDB movie import/manual movies, studios, seats, schedules, and promos. Daily overview metrics use the report endpoint.

## API organization

- Contracts: `src/types/api.ts`
- Error normalization: `src/lib/api-error.ts`
- Backend client/auth header: `src/lib/api-client.ts`
- TMDB client: `src/lib/tmdb-client.ts`
- Auth: `src/services/auth-service.ts`
- Schedule: `src/services/schedule-service.ts`
- Seat/booking/history: `src/services/ticket-service.ts`
- Transaction/Midtrans: `src/services/transaction-service.ts`
- Promo: `src/services/promo-service.ts`
- Admin CRUD/report seam: `src/services/admin-service.ts`

## Payment rules

The frontend sends only `schedule_id`, `seat_id`, and optional `promo_code`. Price, discount, gross amount, user identity, and payment method remain backend-owned. Payment uses the backend-provided Midtrans `redirect_url`. A Midtrans redirect is never treated as proof of payment; `/payment/status/:transactionId` polls the backend transaction state.

Midtrans Dashboard configuration:

- **Finish Redirect URL:** `https://<frontend-host>/payment/finish` — Midtrans appends `?order_id=cinema-<transaction-uuid>&status_code=...&transaction_status=...`; the page validates the prefix/UUID, then replaces the URL with `/payment/status/<uuid>`. Invalid or missing `order_id` shows a safe error without calling the API.
- **Payment Notification URL:** `https://cinema-ticketing-api.onrender.com/api/v1/payment/notification` — server-to-server webhook that the backend verifies via Midtrans GET Status before mutating transaction state.

## Specifications

Feature-level, spec-driven documentation lives in [`docs/specs/`](docs/specs/README.md). It includes acceptance criteria, states, edge cases, API contracts, motion, accessibility, and current limitations.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Security notes

- `.env` is ignored.
- TMDB `VITE_*` credentials are visible in browser bundles. Proxy TMDB through the backend if the token must remain private.
- Midtrans server keys must never be added to this repository.
- The current SPA stores JWT in local storage. Prefer an HttpOnly secure cookie when the backend supports it.

## Design references

- Stitch screenshots and generated HTML: `stitch-reference/`
- UI/UX Pro Max design rules: `design-system/cinereserve/MASTER.md`
