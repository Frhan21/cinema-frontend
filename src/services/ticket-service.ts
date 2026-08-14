import { apiClient } from '../lib/api-client'
import { normalizeApiError } from '../lib/api-error'
import type { ApiResponse, ApiSeat, AvailableSeat, BookingResponse, CreateBookingRequest, TransactionHistoryItem } from '../types/api'
import type { Seat } from '../types/domain'

const parseSeatNumber = (value: string) => {
  const match = value.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/)
  return { row: match?.[1] ?? '?', number: Number(match?.[2] ?? 0) }
}

export const ticketService = {
  async getAvailableSeats(scheduleId: string): Promise<AvailableSeat[]> {
    try {
      const response = await apiClient.get<ApiResponse<AvailableSeat[]>>(`ticket/available-seats/${scheduleId}`)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getStudioSeats(studioId: string): Promise<ApiSeat[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiSeat[]>>(`seat/studio/${studioId}`)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getSeatMap(scheduleId: string, studioId: string, price: number): Promise<Seat[]> {
    const [masterSeats, availableSeats] = await Promise.all([
      this.getStudioSeats(studioId),
      this.getAvailableSeats(scheduleId),
    ])
    const availableIds = new Set(availableSeats.map((seat) => seat.id))
    return masterSeats.map((seat): Seat => {
      const parsed = parseSeatNumber(seat.seat_number)
      return {
        id: seat.id,
        row: parsed.row,
        number: parsed.number,
        status: seat.is_available && availableIds.has(seat.id) ? 'available' : 'occupied',
        price,
      }
    }).sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number)
  },
  async createBooking(payload: CreateBookingRequest): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<ApiResponse<BookingResponse>>('ticket/', payload)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getHistory(): Promise<TransactionHistoryItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<TransactionHistoryItem[]>>('ticket/history')
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
