import { useMutation, useQuery } from '@tanstack/react-query'
import { cinemaService } from '../services/cinema-service'
import { scheduleService } from '../services/schedule-service'
import { ticketService } from '../services/ticket-service'
import { transactionService } from '../services/transaction-service'
import { promoService } from '../services/promo-service'
import type { CreateBookingRequest, Schedule } from '../types/api'

export const useMovies = () =>
  useQuery({ queryKey: ['movies'], queryFn: cinemaService.getMovies })

export const useFeaturedMovies = () =>
  useQuery({ queryKey: ['movies', 'featured'], queryFn: cinemaService.getFeaturedMovies, staleTime: 10 * 60 * 1000 })

export const useGenreMovieRails = () =>
  useQuery({ queryKey: ['movies', 'genres', 'rails'], queryFn: cinemaService.getGenreRails, staleTime: 30 * 60 * 1000 })

export const useMovieSearch = (query: string) =>
  useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => cinemaService.searchMovies(query),
    enabled: query.trim().length >= 2,
  })

export const useMovie = (id?: string) =>
  useQuery({
    queryKey: ['movies', id],
    queryFn: () => cinemaService.getMovie(id as string),
    enabled: Boolean(id),
  })

export const useSchedulesByTmdbId = (tmdbId?: string) =>
  useQuery({
    queryKey: ['schedules', 'tmdb', tmdbId],
    queryFn: () => scheduleService.getByTmdbId(Number(tmdbId)),
    enabled: Boolean(tmdbId && Number.isInteger(Number(tmdbId))),
  })

export const useSeatMap = (schedule?: Schedule) =>
  useQuery({
    queryKey: ['seat-map', schedule?.id],
    queryFn: () => ticketService.getSeatMap(schedule!.id, schedule!.studio_id, schedule!.price),
    enabled: Boolean(schedule),
  })

export const useCreateBooking = () =>
  useMutation({ mutationFn: (payload: CreateBookingRequest) => ticketService.createBooking(payload) })

export const useTickets = () =>
  useQuery({ queryKey: ['ticket-history'], queryFn: ticketService.getHistory })

export const useTransaction = (id?: string) =>
  useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getById(id as string),
    enabled: Boolean(id),
    refetchInterval: (query) => query.state.data?.payment_status === 'pending' ? 5_000 : false,
  })

export const usePayTransaction = () =>
  useMutation({ mutationFn: transactionService.pay })

export const useCancelTransaction = () =>
  useMutation({ mutationFn: transactionService.cancel })

export const useValidatePromo = () =>
  useMutation({ mutationFn: ({ code, totalPrice }: { code: string; totalPrice: number }) => promoService.validate(code, totalPrice) })
