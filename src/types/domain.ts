export type MovieFormat = 'REGULAR' | '2D' | '3D' | 'IMAX' | '4DX'

export interface Showtime {
  id: string
  startsAt: string
  theater: string
  studio: string
  format: MovieFormat
  price: number
  studioId?: string
}

export interface Movie {
  id: string
  title: string
  synopsis: string
  posterUrl: string
  backdropUrl: string
  genres: string[]
  durationMinutes: number
  rating: number
  ageRating: string
  releaseYear: number
  director: string
  trailerKey?: string
  tagline?: string
  showtimes: Showtime[]
}

export interface MovieCollection {
  movies: Movie[]
  page: number
  totalPages: number
  totalResults: number
}

export type SeatStatus = 'available' | 'selected' | 'occupied' | 'premium'

export interface Seat {
  id: string
  row: string
  number: number
  status: SeatStatus
  price: number
}

export interface Ticket {
  id: string
  movie: Movie
  showtime: Showtime
  seats: string[]
  bookingCode: string
  status: 'upcoming' | 'history'
}
