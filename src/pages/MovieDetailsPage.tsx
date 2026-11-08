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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070707_4%,rgba(7,7,7,.86)_45%,transparent),linear-gradient(0deg,#070707,transparent_55%)]" />
        <Container maxWidth="xl" className="relative grid min-h-[520px] items-end gap-8 pb-12 pt-20 md:grid-cols-[210px_1fr_auto]">
          <img src={movie.posterUrl} alt={`Poster ${movie.title}`} className="hidden aspect-[2/3] w-full rounded-xl object-cover shadow-2xl md:block" />
          <div><div className="mb-4 flex gap-2"><Chip label={movie.ageRating} size="small" />{showtimes[0] && <Chip label={showtimes[0].format} size="small" color="primary" />}</div><h1 className="max-w-3xl font-display text-5xl font-extrabold leading-none md:text-6xl">{movie.title}</h1>{movie.tagline && <p className="mt-3 max-w-2xl text-lg italic text-white/55">“{movie.tagline}”</p>}<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/65"><span>{movie.releaseYear}</span>{movie.durationMinutes > 0 && <span>{movie.durationMinutes} min</span>}<span>{movie.genres.join(' · ')}</span><span className="flex items-center gap-1"><StarRounded className="text-primary" /> {movie.rating}/5</span></div></div>
          {movie.trailerKey && <Button component="a" href={`https://www.youtube.com/watch?v=${movie.trailerKey}`} target="_blank" rel="noreferrer" variant="contained" startIcon={<PlayArrow />}>Watch trailer</Button>}
        </Container>
      </section>

      <Container maxWidth="xl" className="grid gap-10 pb-20 md:grid-cols-[1fr_340px]">
        <div><h2 className="font-display text-3xl font-bold">Sinopsis</h2><p className="mt-4 max-w-3xl leading-7 text-white/65">{movie.synopsis}</p><section className="mt-14" aria-labelledby="credits-heading"><h2 id="credits-heading" className="font-display text-3xl font-bold">Sutradara & pemeran</h2><div className="mt-6 flex items-center gap-4 bg-surface p-4">{movie.directorCredit?.profileUrl ? <img src={movie.directorCredit.profileUrl} alt={`Foto ${movie.directorCredit.name}`} loading="lazy" className="h-24 w-20 object-cover" /> : <div className="grid h-24 w-20 shrink-0 place-items-center bg-white/10 font-display text-xl font-bold" aria-hidden="true">{movie.director.slice(0, 1)}</div>}<div><p className="text-sm text-white/55">Sutradara</p><h3 className="mt-1 font-display text-xl font-bold">{movie.director}</h3></div></div>{movie.cast?.length ? <div className="poster-rail mt-7 flex snap-x gap-3 overflow-x-auto pb-4" aria-label="Pemeran utama">{movie.cast.map((person) => <article key={person.id} className="w-32 shrink-0 snap-start"><div className="aspect-[3/4] overflow-hidden bg-white/[.07]">{person.profileUrl ? <img src={person.profileUrl} alt={`Foto ${person.name}`} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-display text-3xl font-bold text-white/45" aria-hidden="true">{person.name.slice(0, 1)}</div>}</div><h3 className="mt-3 text-sm font-bold leading-tight">{person.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-white/50">{person.role || 'Pemeran'}</p></article>)}</div> : null}</section><div className="mt-14"><h2 className="font-display text-3xl font-bold">Trailer & media</h2><div className="relative mt-5 aspect-video overflow-hidden bg-surface">{movie.trailerKey ? <iframe src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}`} title={`${movie.title} trailer`} className="h-full w-full" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <img src={movie.backdropUrl} alt={`Backdrop ${movie.title}`} className="h-full w-full object-cover" />}</div></div></div>
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
