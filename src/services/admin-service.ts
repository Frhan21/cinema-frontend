import { apiClient } from '../lib/api-client'
import { normalizeApiError } from '../lib/api-error'
import type {
  ApiMovie,
  ApiResponse,
  ApiSeat,
  CreateMovieRequest,
  CreatePromoRequest,
  CreateScheduleRequest,
  CreateSeatRequest,
  CreateStudioRequest,
  DailyReport,
  MonthlyReport,
  PaginatedResponse,
  PaginationQuery,
  Promo,
  Schedule,
  Studio,
  Transaction,
  UpdateMovieRequest,
  UpdatePromoRequest,
  UpdateScheduleRequest,
  UpdateSeatRequest,
  UpdateStudioRequest,
} from '../types/api'

async function request<T>(operation: () => Promise<{ data: ApiResponse<T> }>) {
  try {
    return (await operation()).data.data
  } catch (error) {
    throw normalizeApiError(error)
  }
}

async function paginated<T>(operation: () => Promise<{ data: PaginatedResponse<T> }>) {
  try {
    const response = (await operation()).data
    return { ...response, data: response.data ?? [] }
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const adminService = {
  movies: {
    list: (params: PaginationQuery) => paginated(() => apiClient.get<PaginatedResponse<ApiMovie>>('movie/', { params })),
    get: (id: string) => request(() => apiClient.get<ApiResponse<ApiMovie>>(`movie/${id}`)),
    create: (payload: CreateMovieRequest) => request(() => apiClient.post<ApiResponse<ApiMovie>>('movie/', payload)),
    importTmdb: (tmdbId: number) => request(() => apiClient.post<ApiResponse<ApiMovie>>('movie/import', { tmdb_id: tmdbId })),
    update: (id: string, payload: UpdateMovieRequest) => request(() => apiClient.put<ApiResponse<ApiMovie>>(`movie/${id}`, payload)),
    remove: (id: string) => request(() => apiClient.delete<ApiResponse<null>>(`movie/${id}`)),
  },
  studios: {
    list: (params: PaginationQuery) => paginated(() => apiClient.get<PaginatedResponse<Studio>>('studio/', { params })),
    get: (id: string) => request(() => apiClient.get<ApiResponse<Studio>>(`studio/${id}`)),
    create: (payload: CreateStudioRequest) => request(() => apiClient.post<ApiResponse<Studio>>('studio/', payload)),
    update: (id: string, payload: UpdateStudioRequest) => request(() => apiClient.put<ApiResponse<Studio>>(`studio/${id}`, payload)),
    remove: (id: string) => request(() => apiClient.delete<ApiResponse<null>>(`studio/${id}`)),
  },
  seats: {
    list: (params: PaginationQuery) => paginated(() => apiClient.get<PaginatedResponse<ApiSeat>>('seat/', { params })),
    byStudio: (studioId: string) => request(() => apiClient.get<ApiResponse<ApiSeat[]>>(`seat/studio/${studioId}`)),
    create: (payload: CreateSeatRequest) => request(() => apiClient.post<ApiResponse<ApiSeat>>('seat/', payload)),
    update: (id: string, payload: UpdateSeatRequest) => request(() => apiClient.put<ApiResponse<ApiSeat>>(`seat/${id}`, payload)),
    remove: (id: string) => request(() => apiClient.delete<ApiResponse<null>>(`seat/${id}`)),
  },
  schedules: {
    list: (params: PaginationQuery) => paginated(() => apiClient.get<PaginatedResponse<Schedule>>('schedule/', { params })),
    create: (payload: CreateScheduleRequest) => request(() => apiClient.post<ApiResponse<Schedule>>('schedule/', payload)),
    update: (id: string, payload: UpdateScheduleRequest) => request(() => apiClient.put<ApiResponse<Schedule>>(`schedule/${id}`, payload)),
    remove: (id: string) => request(() => apiClient.delete<ApiResponse<null>>(`schedule/${id}`)),
  },
  promos: {
    list: () => request(() => apiClient.get<ApiResponse<Promo[]>>('promo/')),
    create: (payload: CreatePromoRequest) => request(() => apiClient.post<ApiResponse<Promo>>('promo/', payload)),
    update: (id: string, payload: UpdatePromoRequest) => request(() => apiClient.put<ApiResponse<Promo>>(`promo/${id}`, payload)),
    remove: (id: string) => request(() => apiClient.delete<ApiResponse<null>>(`promo/${id}`)),
  },
  transactions: {
    list: () => request(() => apiClient.get<ApiResponse<Transaction[]>>('transaction/')),
  },
  reports: {
    daily: (date: string) => request(() => apiClient.get<ApiResponse<DailyReport>>('report/daily', { params: { date } })),
    monthly: (year: number, month: number) => request(() => apiClient.get<ApiResponse<MonthlyReport>>('report/monthly', { params: { year, month } })),
  },
}
