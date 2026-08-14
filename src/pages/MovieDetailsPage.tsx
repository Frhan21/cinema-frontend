import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Box, Button, Chip, Container, MenuItem, Rating, Select } from '@mui/material'
import { CalendarMonth, EventBusy, PlayArrow, StarRounded } from '@mui/icons-material'
import { useMovie, useSchedulesByTmdbId } from '../hooks/use-cinema'
import { ErrorView, LoadingView } from '../components/StateViews'
import { mapScheduleToShowtime } from '../services/schedule-service'
import { formatJakartaDateTime } from '../utils/date'
import { PageReveal } from '../components/Motion'

export function MovieDetailsPage() {
  const { movieId } = useParams()
  const query = useMovie(movieId)
  const schedulesQuery = useSchedulesByTmdbId(movieId)
  const [showtimeId, setShowtimeId] = useState('')
  if (query.isLoading) return <LoadingView />
  if (query.isError || !query.data) return <ErrorView message={query.error?.message ?? 'Movie not found'} retry={() => void query.refetch()} />
  const movie = query.data
  const showtimes = schedulesQuery.data?.map(mapScheduleToShowtime) ?? []
  const selected = showtimeId || showtimes[0]?.id || ''

  return (
    <PageReveal>
      <section className="relative min-h-[520px] overflow-hidden">
        <img src={movie.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d0e0f_4%,rgba(13,14,15,.82)_45%,transparent),linear-gradient(0deg,#0d0e0f,transparent_55%)]" />
        <Container maxWidth="xl" className="relative grid min-h-[520px] items-end gap-8 pb-12 pt-20 md:grid-cols-[210px_1fr_auto]">
          <img src={movie.posterUrl} alt={`Poster ${movie.title}`} className="hidden aspect-[2/3] w-full rounded-xl object-cover shadow-2xl md:block" />
          <div><div className="mb-4 flex gap-2"><Chip label={movie.ageRating} size="small" />{showtimes[0] && <Chip label={showtimes[0].format} size="small" color="primary" />}</div><h1 className="max-w-3xl font-display text-5xl font-extrabold leading-none md:text-6xl">{movie.title}</h1>{movie.tagline && <p className="mt-3 max-w-2xl text-lg italic text-white/55">“{movie.tagline}”</p>}<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/65"><span>{movie.releaseYear}</span>{movie.durationMinutes > 0 && <span>{movie.durationMinutes} min</span>}<span>{movie.genres.join(' · ')}</span><span className="flex items-center gap-1"><StarRounded className="text-primary" /> {movie.rating}/5</span></div></div>
          {movie.trailerKey && <Button component="a" href={`https://www.youtube.com/watch?v=${movie.trailerKey}`} target="_blank" rel="noreferrer" variant="contained" startIcon={<PlayArrow />}>Watch trailer</Button>}
        </Container>
      </section>

      <Container maxWidth="xl" className="grid gap-10 pb-20 md:grid-cols-[1fr_340px]">
        <div><p className="eyebrow text-primary">Story</p><h2 className="font-display text-2xl font-bold">Synopsis</h2><p className="mt-4 max-w-3xl leading-7 text-white/65">{movie.synopsis}</p><div className="mt-8 border-t border-white/10 pt-6 text-sm"><span className="text-white/45">Director</span><strong className="ml-6">{movie.director}</strong></div><div className="mt-12"><p className="eyebrow text-primary">Preview</p><h2 className="font-display text-2xl font-bold">Media</h2><div className="relative mt-5 aspect-video overflow-hidden rounded-xl border border-white/10">{movie.trailerKey ? <iframe src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}`} title={`${movie.title} trailer`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <img src={movie.backdropUrl} alt={`Backdrop ${movie.title}`} className="h-full w-full object-cover" />}</div></div></div>
        <aside className="h-fit rounded-xl border border-white/10 bg-surface p-5 md:sticky md:top-24">
          <h2 className="font-display text-xl font-bold">Book Tickets</h2><p className="mt-1 text-sm text-white/50">Sessions are published by the cinema administrator.</p>
          {schedulesQuery.isError ? <Alert severity="error" className="!mt-6" action={<Button color="inherit" onClick={() => void schedulesQuery.refetch()}>Retry</Button>}>Showtimes could not be loaded.</Alert> : schedulesQuery.isLoading ? <div className="mt-6 h-28 animate-pulse rounded-lg bg-white/5" /> : showtimes.length ? <><label className="mt-6 block text-xs font-bold uppercase tracking-widest text-white/45" htmlFor="showtime">Showtime</label><Select id="showtime" fullWidth value={selected} onChange={(event) => setShowtimeId(event.target.value)} className="!mt-2">{showtimes.map((item) => <MenuItem key={item.id} value={item.id}>{formatJakartaDateTime(item.startsAt)} · {item.studio}</MenuItem>)}</Select><Box className="mt-5 flex items-center gap-2 text-sm text-white/60"><CalendarMonth fontSize="small" /> Times shown in Asia/Jakarta</Box></> : <Alert icon={<EventBusy />} severity="info" className="!mt-6">No showtimes have been published for this movie yet.</Alert>}
          <Rating value={movie.rating} readOnly precision={0.1} className="!mt-5" />
          {selected ? <Button component={Link} to={`/booking/${movie.id}/${selected}`} fullWidth variant="contained" className="!mt-6">Select seats</Button> : <Button fullWidth variant="outlined" className="!mt-6" disabled>Schedule unavailable</Button>}
        </aside>
      </Container>
    </PageReveal>
  )
}
