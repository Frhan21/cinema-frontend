import { apiClient } from '../lib/api-client'
import { normalizeApiError } from '../lib/api-error'
import type { ApiResponse, Schedule } from '../types/api'
import type { Showtime } from '../types/domain'

export const mapScheduleToShowtime = (schedule: Schedule): Showtime => ({
  id: schedule.id,
  startsAt: schedule.start_time,
  theater: 'CineReserve',
  studio: schedule.studio.name,
  studioId: schedule.studio_id,
  format: 'REGULAR',
  price: schedule.price,
})

export const scheduleService = {
  async getUpcoming(): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<ApiResponse<Schedule[]>>('schedule/upcoming')
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getByTmdbId(tmdbId: number): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<ApiResponse<Schedule[]>>(`schedule/movie/tmdb/${tmdbId}`)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getById(id: string): Promise<Schedule> {
    try {
      const response = await apiClient.get<ApiResponse<Schedule>>(`schedule/${id}`)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
