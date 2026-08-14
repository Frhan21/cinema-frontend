import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Chip, Container } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useMovie, useSchedulesByTmdbId, useSeatMap } from '../hooks/use-cinema'
import { useBookingStore, selectBookingTotal } from '../stores/booking-store'
import { SeatMap } from '../components/SeatMap'
import { ErrorView, LoadingView } from '../components/StateViews'
import { mapScheduleToShowtime } from '../services/schedule-service'
import { formatJakartaDateTime } from '../utils/date'
import type { Seat } from '../types/domain'
import { PageReveal } from '../components/Motion'

export function SeatSelectionPage() {
  const { movieId, showtimeId } = useParams()
  const navigate = useNavigate()
  const movieQuery = useMovie(movieId)
  const schedulesQuery = useSchedulesByTmdbId(movieId)
  const schedule = schedulesQuery.data?.find((item) => item.id === showtimeId)
  const seatsQuery = useSeatMap(schedule)
  const selectedSeats = useBookingStore((state) => state.selectedSeats)
  const storedMovieId = useBookingStore((state) => state.movie?.id)
  const storedShowtimeId = useBookingStore((state) => state.showtime?.id)
  const setSelection = useBookingStore((state) => state.setSelection)
  const toggleSeat = useBookingStore((state) => state.toggleSeat)
  const total = useBookingStore(selectBookingTotal)
  const selectedIds = useMemo(() => new Set(selectedSeats.map((seat) => seat.id)), [selectedSeats])
  const movie = movieQuery.data
  const showtime = schedule ? mapScheduleToShowtime(schedule) : undefined

  const handleToggle = (seat: Seat) => {
    if (selectedSeats.length >= 8 && !selectedIds.has(seat.id)) return
    toggleSeat(seat)
  }

  useEffect(() => {
    if (movie && showtime && (storedMovieId !== movie.id || storedShowtimeId !== showtime.id)) {
      setSelection(movie, showtime)
    }
  }, [movie, setSelection, showtime, storedMovieId, storedShowtimeId])

  if (movieQuery.isLoading || schedulesQuery.isLoading || seatsQuery.isLoading) return <LoadingView label="Preparing the auditorium…" />
  if (movieQuery.isError || schedulesQuery.isError || seatsQuery.isError || !movie || !showtime) return <ErrorView message={movieQuery.error?.message ?? schedulesQuery.error?.message ?? seatsQuery.error?.message ?? 'Session unavailable'} retry={() => { void schedulesQuery.refetch(); void seatsQuery.refetch() }} />

  return (
    <PageReveal><Container maxWidth="xl" className="py-10 md:py-16">
      <Button component={Link} to={`/movies/${movie.id}`} color="inherit" startIcon={<ArrowBack />}>Back to movie</Button>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-3 flex gap-2"><Chip label={showtime.format} color="primary" size="small" /><span className="eyebrow">{formatJakartaDateTime(showtime.startsAt)} · {showtime.studio}</span></div><h1 className="font-display text-4xl font-extrabold md:text-5xl">{movie.title}</h1></div><p className="text-sm text-white/50">Select up to 8 seats</p></div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_330px]">
        <div className="rounded-xl border border-white/10 bg-surface p-4 py-10 sm:p-8"><SeatMap seats={seatsQuery.data ?? []} selectedIds={selectedIds} onToggle={handleToggle} /></div>
        <aside className="h-fit rounded-xl border border-white/10 bg-[#202224] p-6 lg:sticky lg:top-24"><p className="eyebrow">Booking summary</p><h2 className="mt-2 font-display text-xl font-bold">Your seats</h2>{selectedSeats.length ? <div className="mt-6 flex flex-wrap gap-2">{selectedSeats.map((seat) => <Chip key={seat.id} label={seat.id} color="secondary" onDelete={() => toggleSeat(seat)} />)}</div> : <p className="mt-8 rounded-lg border border-dashed border-white/15 p-6 text-center text-sm leading-6 text-white/45">No seats selected yet.<br />Pick seats from the map.</p>}<div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5"><span className="text-sm text-white/55">Total</span><strong className="font-display text-2xl">Rp{total.toLocaleString('id-ID')}</strong></div><Button fullWidth variant="contained" disabled={!selectedSeats.length} className="!mt-5" onClick={() => navigate('/payment')}>Proceed to payment</Button></aside>
      </div>
    </Container></PageReveal>
  )
}
