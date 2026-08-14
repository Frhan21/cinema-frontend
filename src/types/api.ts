export type UUID = string
export type UserRole = 'user' | 'admin'
export type PaymentStatus = 'pending' | 'paid' | 'cancelled'

export interface ApiResponse<T> {
  message: string
  data: T
}

export interface PaginationMeta {
  page: number
  per_page: number
  total_data: number
  total_page: number
}

export interface PaginatedResponse<T> {
  message: string
  data: T[] | null
  meta: PaginationMeta
}

export interface ApiErrorResponse {
  message: string
  error: string
}

export interface PaginationQuery {
  page?: number
  per_page?: number
}

export interface ApiUser {
  id: UUID
  name: string
  email: string
  role: UserRole
}

export interface AuthSession extends ApiUser {
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
}

export interface ApiMovie {
  id: UUID
  tmdb_id?: number
  title: string
  genre: string
  description: string
  duration: number
  poster_url: string
}

export interface CreateMovieRequest {
  tmdb_id?: number
  title: string
  genre: string
  description: string
  duration: number
  poster_url: string
}

export type UpdateMovieRequest = Partial<CreateMovieRequest>

export interface Studio {
  id: UUID
  name: string
  capacity: number
  facilities: string
}

export interface CreateStudioRequest {
  name: string
  capacity: number
  facilities: string
}

export type UpdateStudioRequest = Partial<CreateStudioRequest>

export interface ApiSeat {
  id: UUID
  studio_id: UUID
  seat_number: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface CreateSeatRequest {
  studio_id: UUID
  seat_number: string
  is_available?: boolean
}

export interface UpdateSeatRequest {
  id: UUID
  studio_id: UUID
  seat_number: string
  is_available: boolean
}

export interface AvailableSeat {
  id: UUID
  seat_number: string
}

export interface Schedule {
  id: UUID
  movie_id: UUID
  tmdb_id: number
  studio_id: UUID
  studio: Pick<Studio, 'id' | 'name'>
  start_time: string
  end_time: string
  price: number
}

export interface CreateScheduleRequest {
  movie_id: UUID
  studio_id: UUID
  start_time: string
  price: number
}

export type UpdateScheduleRequest = Partial<CreateScheduleRequest>

export interface CreateBookingRequest {
  schedule_id: UUID
  seat_id: UUID[]
  promo_code?: string
}

export interface BookingResponse {
  transaction_id: UUID
  ticket_ids: UUID[]
  total_price: number
  payment_status: PaymentStatus
}

export interface TransactionHistoryItem {
  id: UUID
  total_price: number
  payment_status: PaymentStatus
  created_at: string
}

export interface TransactionItem {
  id?: UUID
  ticket_id?: UUID
  price?: number
  [key: string]: unknown
}

export interface Transaction {
  id: UUID
  user_id: UUID
  total_price: number
  payment_method: string
  payment_status: PaymentStatus
  created_at: string
  updated_at: string
  user: ApiUser
  items: TransactionItem[]
}

export interface PaymentSession {
  order_id: string
  token: string
  redirect_url: string
  payment_status: PaymentStatus
}

export interface PromoValidation {
  code: string
  discount: number
  discounted_price: number
  original_price: number
}

export interface Promo {
  id: UUID
  code: string
  description: string
  discount: number
  max_usage: number
  used_count: number
  start_date: string
  end_date: string
  is_active: boolean
}

export interface CreatePromoRequest {
  code: string
  description: string
  discount: number
  max_usage: number
  start_date: string
  end_date: string
}

export type UpdatePromoRequest = Partial<CreatePromoRequest>

export interface ReportBreakdown {
  movie_id?: UUID
  movie_title?: string
  studio_id?: UUID
  studio_name?: string
  tickets_sold: number
  revenue: number
}

export interface DailyReport {
  date: string
  total_tickets_sold: number
  total_revenue: number
  by_movie: ReportBreakdown[]
  by_studio: ReportBreakdown[]
}

export interface MonthlyReport extends Omit<DailyReport, 'date'> {
  year: number
  month: number
  daily_breakdown: Array<{ date: string; total_tickets_sold: number; total_revenue: number }>
}
