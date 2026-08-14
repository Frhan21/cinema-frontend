import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie, Seat, Showtime } from '../types/domain'

interface BookingState {
  movie: Movie | null
  showtime: Showtime | null
  selectedSeats: Seat[]
  promoCode: string
  transactionId: string | null
  setSelection: (movie: Movie, showtime: Showtime) => void
  toggleSeat: (seat: Seat) => void
  setPromoCode: (code: string) => void
  setTransactionId: (id: string) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      movie: null,
      showtime: null,
      selectedSeats: [],
      promoCode: '',
      transactionId: null,
      setSelection: (movie, showtime) =>
        set({ movie, showtime, selectedSeats: [], promoCode: '', transactionId: null }),
      toggleSeat: (seat) =>
        set((state) => {
          if (seat.status === 'occupied') return state
          const selected = state.selectedSeats.some((item) => item.id === seat.id)
          return {
            selectedSeats: selected
              ? state.selectedSeats.filter((item) => item.id !== seat.id)
              : [...state.selectedSeats, seat],
          }
        }),
      setPromoCode: (promoCode) => set({ promoCode }),
      setTransactionId: (transactionId) => set({ transactionId }),
      reset: () => set({ movie: null, showtime: null, selectedSeats: [], promoCode: '', transactionId: null }),
    }),
    { name: 'cineflow-booking' },
  ),
)

export const selectBookingTotal = (state: BookingState) =>
  state.selectedSeats.reduce((total, seat) => total + seat.price, 0)
