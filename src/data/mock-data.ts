import type { Movie, Seat, Ticket } from '../types/domain'

const image = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const movies: Movie[] = [
  {
    id: 'nebula-prime',
    title: 'Nebula Prime: The Last Horizon',
    synopsis:
      'Humanity’s last deep-space crew follows a signal beyond the mapped universe and discovers a choice that could rewrite their future.',
    posterUrl: image('photo-1446776811953-b23d57bd21aa', 700),
    backdropUrl: image('photo-1462331940025-496dfbfc7564', 1800),
    genres: ['Sci-Fi', 'Adventure'],
    durationMinutes: 146,
    rating: 4.8,
    ageRating: 'PG-13',
    releaseYear: 2026,
    director: 'Mara Voss',
    showtimes: [
      { id: 'nebula-1430', startsAt: '2026-08-08T14:30:00+07:00', theater: 'CineReserve Downtown', studio: 'Screen 01', format: 'IMAX', price: 85000 },
      { id: 'nebula-1930', startsAt: '2026-08-08T19:30:00+07:00', theater: 'CineReserve Downtown', studio: 'Screen 01', format: 'IMAX', price: 95000 },
    ],
  },
  {
    id: 'neon-samurai',
    title: 'Neon Samurai: Uprising',
    synopsis: 'A disgraced guardian returns to a rain-soaked megacity for one final mission.',
    posterUrl: image('photo-1519608487953-e999c86e7455', 700),
    backdropUrl: image('photo-1519608487953-e999c86e7455', 1800),
    genres: ['Action', 'Cyberpunk'],
    durationMinutes: 128,
    rating: 4.6,
    ageRating: 'R',
    releaseYear: 2026,
    director: 'Ken Arata',
    showtimes: [{ id: 'neon-1600', startsAt: '2026-08-08T16:00:00+07:00', theater: 'CineReserve Central', studio: 'Screen 04', format: '4DX', price: 90000 }],
  },
  {
    id: 'forest-echoes',
    title: 'Whispers of the Eirona',
    synopsis: 'An ancient forest awakens when its final keeper disappears.',
    posterUrl: image('photo-1448375240586-882707db888b', 700),
    backdropUrl: image('photo-1448375240586-882707db888b', 1800),
    genres: ['Fantasy', 'Mystery'],
    durationMinutes: 119,
    rating: 4.5,
    ageRating: 'PG-13',
    releaseYear: 2026,
    director: 'Elena Hart',
    showtimes: [{ id: 'forest-1745', startsAt: '2026-08-08T17:45:00+07:00', theater: 'CineReserve Garden', studio: 'Screen 02', format: '2D', price: 65000 }],
  },
  {
    id: 'midnight-odyssey',
    title: 'The Midnight Odyssey',
    synopsis: 'A crew of explorers crosses a volatile nebula to recover a message from the future.',
    posterUrl: image('photo-1419242902214-272b3f66ee7a', 700),
    backdropUrl: image('photo-1451187580459-43490279c0fa', 1800),
    genres: ['Sci-Fi', 'Drama'],
    durationMinutes: 152,
    rating: 4.8,
    ageRating: 'PG-13',
    releaseYear: 2026,
    director: 'Jonathan Reeve',
    showtimes: [{ id: 'midnight-2030', startsAt: '2026-08-08T20:30:00+07:00', theater: 'CineReserve Downtown', studio: 'Screen 03', format: 'IMAX', price: 95000 }],
  },
]

export const buildSeats = (): Seat[] => {
  const occupied = new Set(['A3', 'A7', 'B2', 'B8', 'C5', 'D1', 'D10', 'E4', 'F6'])
  return ['A', 'B', 'C', 'D', 'E', 'F'].flatMap((row, rowIndex) =>
    Array.from({ length: 10 }, (_, index) => {
      const id = `${row}${index + 1}`
      const premium = rowIndex >= 4
      return {
        id,
        row,
        number: index + 1,
        status: occupied.has(id) ? 'occupied' : premium ? 'premium' : 'available',
        price: premium ? 115000 : 95000,
      } satisfies Seat
    }),
  )
}

export const tickets: Ticket[] = [
  {
    id: 'ticket-001',
    movie: movies[0],
    showtime: movies[0].showtimes[1],
    seats: ['H12', 'H13'],
    bookingCode: 'CFR-8Q2K9',
    status: 'upcoming',
  },
  {
    id: 'ticket-002',
    movie: movies[1],
    showtime: movies[1].showtimes[0],
    seats: ['D08', 'D09', 'D10'],
    bookingCode: 'CFR-3PN7M',
    status: 'upcoming',
  },
]
