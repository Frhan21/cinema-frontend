# Film Booking Application - UI/UX Planning

> **Status:** Planning Phase
> **Main Features:** Booking, Ticket, Seat Selection, Payment
> **Backend:** Available & Ready
> **Focus:** UI/UX Design First

---

## Overview

This is a comprehensive UI/UX planning document for a movie booking application with the following core features:
- Movie browsing and discovery
- Seat selection for showtimes
- Booking confirmation
- Digital ticket display
- Payment processing (via integrated backend gateway)

---

## 1. User Flow Analysis

### Primary Flow: Book Movies
```
Home/Discovery → Movie Details → Select Showtime → Select Seats → Review Booking → Payment → Confirmation → Ticket Booking Success
```

### Key User Flows

#### Flow 1: Browse and Book
1. User lands on Home → Browse movies/showtimes
2. Click movie → View details & showtimes
3. Select showtime → View seating layout
4. Select seats → See summary
5. Proceed to checkout → Payment
6. Success → View ticket

#### Flow 2: Skip to Ticket (After Successful Booking)
7. Click ticket → Digital ticket interface

#### Flow 3: Cancel Booking
8. Cancel process → Return to selection

### States for Each Flow
- **Success**: Booking confirmed, ticket displayed
- **Error**: Payment failed, seat unavailable
- **Loading**: Processing actions
- **Empty**: No shows available, no tickets

---

## 2. Screen Architecture

### Application Structure (SPA)

```
/src
├── components
│   ├── common
│   │   ├── Header
│   │   ├── Footer
│   │   ├── Navigation
│   │   ├── LoadingSpinner
│   │   └── ErrorDisplay
│   ├── movie
│   │   ├── MovieCard
│   │   ├── MovieDetail
│   │   └── MovieList
│   ├── booking
│   │   ├── TheaterLayout
│   │   ├── SeatMap
│   │   ├── SeatSelection
│   │   └── BookingSummary
│   └── payment
│       ├── PaymentForm
│       ├── PaymentSuccess
│       └── PaymentError
├── hooks
│   ├── useMovieData.ts
│   ├── useSeatSelection.ts
│   ├── useBooking.ts
│   └── usePayment.ts
├── views
│   ├── Home.tsx
│   ├── MovieDetails.tsx
│   ├── SeatSelection.tsx
│   ├── Checkout.tsx
│   └── MyTickets.tsx
├── context
│   ├── BookingContext.tsx
│   ├── MovieContext.tsx
│   └── PaymentContext.tsx
└── types
    ├── movie.ts
    ├── booking.ts
    ├── payment.ts
    └── user.ts
```

### Screen Breakdown

| Screen Name | Purpose | Main Components |
|-------------|---------|-----------------|
| **Home** | Movie discovery | MovieList, FeaturedMovies, Header, Navigation |
| **Movie Details** | View movie info | MovieDetail, ShowtimeSelector, Trailer, SimilarMovies |
| **Seat Selection** | Choose seats | TheaterMap, SeatGrid, Legend, Summary |
| **Checkout** | Review & payment | BookingSummary, PaymentForm, OrderTotal |
| **Payment Success** | Confirmation | DigitalTicket, BookingConfirmation |
| **My Tickets** | View past bookings | TicketList, TicketDetail, ShareableTicket |

---

## 3. Component Structure & Reusability

### High-Level Components (Page Views)
- `HomeView` — Entry point with featured movies
- `MovieDetailsView` — Detailed movie info & showtimes
- `SeatSelectionView` — Interactive seat selection
- `CheckoutView` — Finalize booking & payment
- `TicketView` — Display digital ticket

### Reusable Components

#### Layout Components
- `AppLayout` / `MobileLayout` — Main container with navigation
- `Header` — Logo, nav links, user profile
- `Footer` — Links, social, newsletter signup

#### Movie Components
- `MovieCard` — Thumbnail, title, rating, duration
- `MovieList` — ScrollView of movies (horizontal/vertical)
- `MovieDetail` — Large poster, info, cast, crew, showtime grid

#### Seat Selection Components
- `TheaterMap` — Visual theater layout representation
- `SeatGrid` — Grid of seats (rows × columns)
- `Seat` — Individual seat {occupied, available, selected, vip}
- `SeatLegend` — Visual legend for seat types

#### Checkout & Payment Components
- `BookingSummary` — Selected seats, movie, showtime, price breakdown
- `PaymentForm` — Credit card form, validation
- `OrderSummary` — Total calculation
- `PaymentButton` — Primary CTA for payment

#### Ticket Components
- `DigitalTicket` — QR code, seat info, movie info
- `TicketSummary` — Booking details display

#### Common Components
- `LoadingSpinner` — Spinner for async operations
- `ErrorDisplay` — Error message & retry button
- `EmptyState` — "No results" / "No tickets" placeholder
- `ConfirmDialog` — Confirmation prompts
- `Notification` — Toast / inline messages

---

## 4. State Management Strategy

### Booking State (`BookingContext`)
```typescript
interface BookingState {
  movie: Movie | null;
  showtime: Showtime | null;
  selectedSeats: Seat[];
  totalPrice: number;
  bookingId: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}
```

### Movie State (`MovieContext`)
```typescript
interface MovieState {
  movies: Movie[];
  currentMovie: Movie | null;
  featuredMovies: Movie[];
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}
```

### Payment State (`PaymentContext`)
```typescript
interface PaymentState {
  method: PaymentMethod;
  processing: boolean;
  success: boolean;
  error: PaymentError | null;
}
```

### Local Component State (Hooks)
- `useSeatSelection()` — Seat click handlers, availability
- `useMovieData()` — Fetching movie list
- `useShowtimes()` — Fetching available showtimes

---

## 5. Key Screen UI Requirements

### 5.1 Home Screen
- **Header**: Logo, Navigation (Home, Movies, My Tickets, Profile)
- **Hero Section**: Featured/Now Playing movie with bold CTA
- **Movie List**: Horizontal scroll of horizontal movie cards
- **Categories/Tags**: Genre filters (Action, Comedy, Drama, etc.)
- **Search Bar**: Search movie by title

**UI Elements:**
- Hero banner with overlay on movie poster
- Movie card: Poster image, title, rating badge, DURATION
- Film emoji/swipe hints for horizontal scroll
- Curve/rounded scroll containers

### 5.2 Movie Details Screen
- **Header**: Back button, Share, Favorite button
- **Main Content**:
  - Large backdrop poster (blur effect background)
  - Title, rating, year, duration
  - Synopsis with truncated long text
  - Cast & Crew previews
  - Genre tags
- **Showtime Section**:
  - Date selector (tabs or similar selector)
  - Showtime chips/buttons (e.g., "10:30", "13:45", "17:00")
  - Legend/keys for shows (IMAX, 3D, Regular)
- **Cinematography Section**: Screens and theater layout preview (visual)

**UI Elements:**
- Backdrop with gradient overlay
- "Book Now" floating/bottom CTA for quick booking
- Filled vs. unfilled movie block styling
- Round selector for dates (horizontal strip)
- Showtime checkmarks for selected time
- Tag badges for film format/floor plan

### 5.3 Seat Selection Screen
- **Header**: Movie title, showtime date & time, Cancel "Back" button
- **Main Visual**:
  - Theater layout view (visual representation)
  - Column labels (A, B, C, D, etc.)
  - Row indicators (1, 2, 3, 4, etc.)
  - Screen depiction (curved line)
- **Seat Grid**:
  - SEAT_WIDTH × SEAT_HEIGHT avatar at rows; Use proper locales for L/R, 12/seats/row if more than 9
  - Legend: Available, Selected, Occupied, VIP, Notch (if unavailable)
  - Tertiary states: Loading for seat availability
  - Seat tap/hover states with nice transition/effect
- **Summary Section** (sidebar or bottom sheet on mobile):
  - Selected seats (e.g., "C2, D3, E1")
  - Seat count
  - Base price × Seat count
  - Additional fees (if any)
  - "Proceed to Checkout" CTA
- **Accessibility**: Keyboard navigation through seats, ARIA labels

**UI Elements:**
- Panel styling: rounded corners with shadow, slight background
- Zoom or pad/magnify buttons if adding seat click logic later
- Spacing: 8px between seats (min), consistent grid alignment

### 5.4 Checkout Screen
- **Header**: Back button, Order summary title
- **Everything in one center-aligned panel**:
  - Booking summary:
    - Movie poster, title, duration
    - Showtime: Date & Time, Theater
    - Selected seats list with seat prices
  - Price breakdown:
    - Subtotal: 3 seats × SEAT_PRICE
    - Service fee (if applicable)
    - Tax (if applicable)
    - **TOTAL**
  - Payment method selection:
    - Radio buttons or card style for Card, Bank Transfer, etc.
  - Card details form:
    - Cardholder name
    - Card number (auto-format with spaces)
    - Expiry date
    - CVC
    - Auto-hide/show depending on method
  - Terms checkbox (logic: cannot proceed unless checked)
- **Action Area**:
  - Confirm and Pay button
  - Primary color CTA, disabled until form valid

**UI Elements:**
- Card/panel overlay, column content flow
- Price hierarchies: secondary text for detailed breakdown
- Input fields: label + value in same line (layout design)
- Validated inputs and visual feedback
- Error states for missing/text mismatched fields

### 5.5 Payment Success Screen
- **Header**: Confirmed title
- **Ticket Section**:
  - Wide flat ticket shape (with cut corners optional)
  - QR code
  - Booking ID
  - Movie title & time
  - Seat number(s)
  - Price details
  - Theater name (if applicable)
- **Action Area**:
  - "Book Another Movie" or "View My Tickets" buttons
  - Secondary, clear CTAs
- **Indicators**:
  - Checkmark (green) or confetti (optional)
  - Confetti on high-end designs

**UI Elements:**
- Primary CTA for next step, secondary link/text for alternative
- Ticket design: clean, minimal, organized (spacing, rows, price)
- Ticket actions in 1–2 ways (buttons or links)
- Placeholders for fields where backend hasn't returned values yet

### 5.6 My Tickets Screen
- **Header**: Title, maybe filter/tabs (Upcoming, Past)
- **Ticket List**:
  - Card for each booking
  - Quick details shown: Movie title, showtime, seats, price
  - CTA: "View Ticket / Book Again"
- **Detail View** (modal/popup when click):
  - Full ticket (same as Payment Success ticket)
  - Actions: Share, Download PDF, Book Again

**UI Elements:**
- Ticket cards with flat design; preview showing title + date + seats
- List items with consistent spacing, reasonable height match
- CTAs inside each card
- Secondary sources for label/action-text

### 5.7 Tertiary States (All Screens)

| State | UI Pattern | User Action |
|-------|------------|-------------|
| **Loading** | Spinner, Skeleton, Progress bar | Wait automatically |
| **Empty** | "No movies available" / "No tickets yet" | Action: Browse movies |
| **Error** | Error message, "Retry" button / try again | Action: Retry or contact support |
| **Success** | Success message, CTA buttons | Action: Continue journey |

---

## 6. Accessibility Requirements

### Keyboard Navigation
- All interactive elements reachable via Tab
- `Enter`/`Space` activate buttons/links
- `Esc` closes dialogs/inputs
- Focus states visible (outline or ring)

### ARIA Features
- Seat map with ARIA labels for each seat (`aria-label="Seat A1, available"`)
- Live regions for dynamic updates (e.g., seat selection)
- Appropriate `aria-live` regions for error messages
- `aria-expanded` for accordions/dropdowns
- `aria-disabled` for loading states

### Screen Reader Support
- Logical heading hierarchy (`h1` → `h2` → `h3`)
- Alt text for all images
- Descriptive form labels and error messages

### Color & Contrast
- Minimum 4.5:1 contrast ratio for text
- Distinguishable visual feedback for seat states (not just color)
- Focus indicators color-blind safe if possible

### Motion & Transitions
- Respect `prefers-reduced-motion` media query
- Limit animation complexity and duration

---

## 7. Responsive Design

### Breakpoints (Mobile-First)

| Device | Breakpoint | Layout Strategy |
|--------|------------|-----------------|
| **Mobile** | < 640px | One column, vertical scroll, bottom sheets for detailed views |
| **Tablet** | 641px - 1024px | Two-column layouts, larger touch targets, side-by-side cards |
| **Desktop** | > 1024px | Multi-column, dense layouts, max-width containers |

### Responsive Components
- **Header**: Shrink nav items, slide-out menu on mobile
- **Movie Cards**: Flexible grid (auto-fill min 200px)
- **Seat Map**: Scale theater representation, adjust grid sizing
- **Checkout**: Panel moves from left side to full-width background overlay on mobile
- **Ticket**: Card format on mobile, poster + ticket on desktop

---

## 8. Data Structure Requirements

### Movie
```typescript
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  duration: number; // in minutes
  genre: string[];
  year: number;
  synopsis: string;
  showtimes: Showtime[];
}
```

### Showtime
```typescript
interface Showtime {
  id: string;
  movieId: string;
  roomId: string;
  theaterName: string;
  datetime: Date;
  isVip: boolean;
  is3D: boolean;
  format: '2D' | '3D' | 'IMAX';
  basePrice: number;
}
```

### Seat
```typescript
interface Seat {
  id: string;
  row: string; // 'A', 'B', 'C', ...
  number: number; // 1, 2, 3, ...
  status: 'available' | 'occupied' | 'booked'; // after backend fetch
  type: 'standard' | 'vip';
}
```

### Booking
```typescript
interface Booking {
  id: string;
  movieId: string;
  showtimeId: string;
  seats: Seat[];
  totalPrice: number;
  bookingDate: Date;
  status: 'confirmed' | 'paid' | 'pending';
}
```

---

## 9. API Integration Strategy

### Data Fetching Hooks
- `useMovieData()` — Fetch all movies from `/api/movies`
- `useShowtimes(movieId)` — Fetch showtimes from `/api/movies/:id/showtimes`
- `useSeatAvailability(showtimeId)` — Fetch available seats from `/api/showtimes/:id/seats`
- `createBooking()` — POST booking data to `/api/bookings`
- `searchMovies(query)` — GET search results

### Error Handling
- Fetch failures → Error state with retry button
- Payment failures → Graceful error UI (not alert)
- 401/403 → Redirect to login or show error

---

## 10. Future Enhancements

### Phase 2 Features
- User authentication & profile
- Favorites/watchlist
- Reviews & ratings
- Push notifications (booking reminders)

### Phase 3 Features
- Group booking
- Group chat / coordinated booking
- Dynamic pricing (early bird, peak hours)
- Loyalty/rewards points
- Integration with streaming services (buy now, watch at home)

---

## 11. Next Steps

1. ✅ Review this UI/UX planning
2. ✅ Confirm structure with stakeholders
3. 🔄 **Design Phase**: Use Stitch to generate UI/UX designs based on this plan
4. 🔄 **Implementation Phase**: Build React components following this structure
5. 🔄 **Integration Phase**: Connect to backend APIs
6. 🔄 **Testing Phase**: Test all flows, accessibility, and error states

---

## Notes for Stitch Design Integration

When you provide this plan to Stitch for UI/UX design, please include:

- This complete planning document
- The screen structure and component breakdown
- The responsive breakpoints and mobile-first approach
- The tertiary state patterns (loading, error, empty, success)
- Accessibility requirements (keyboard navigation, ARIA labels)
- The tech preferences (if any specified)

---

**Document Version:** 1.0
**Created:** 2026-08-06
**Last Updated:** 2026-08-06