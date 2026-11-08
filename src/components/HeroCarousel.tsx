import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, IconButton } from '@mui/material'
import { Add, ArrowBack, ArrowForward, InfoOutlined, PlayArrow, VolumeOff } from '@mui/icons-material'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Movie } from '../types/domain'

const SLIDE_TIME = 8000

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const [active, setActive] = useState(0)
  const [videoReadyFor, setVideoReadyFor] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const movie = movies[active]

  useEffect(() => {
    if (reduceMotion || !movie?.trailerKey) return
    const videoTimer = window.setTimeout(() => setVideoReadyFor(movie.id), 2800)
    const slideTimer = window.setTimeout(() => setActive((value) => (value + 1) % movies.length), SLIDE_TIME)
    return () => { window.clearTimeout(videoTimer); window.clearTimeout(slideTimer) }
  }, [active, movie?.id, movie?.trailerKey, movies.length, reduceMotion])

  const select = (index: number) => setActive((index + movies.length) % movies.length)
  if (!movie) return null
  const showVideo = videoReadyFor === movie.id

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-black lg:min-h-[calc(100svh-72px)]" aria-roledescription="carousel" aria-label="Film unggulan">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={movie.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.15 : 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <img src={movie.backdropUrl} alt="" className="h-full w-full object-cover" />
          {showVideo && movie.trailerKey && <iframe className="pointer-events-none absolute inset-0 hidden h-full w-full scale-[1.28] lg:block" src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${movie.trailerKey}&modestbranding=1&playsinline=1`} title={`Preview ${movie.title}`} allow="autoplay; encrypted-media" tabIndex={-1} />}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#070707_0%,rgba(7,7,7,.9)_31%,rgba(7,7,7,.22)_68%),linear-gradient(0deg,#070707_0%,transparent_48%)]" />

      <Container maxWidth="xl" className="relative flex min-h-[720px] items-end pb-40 pt-28 lg:min-h-[calc(100svh-72px)] lg:items-center lg:pb-24">
        <AnimatePresence mode="wait">
          <motion.div key={movie.id} className="max-w-2xl" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            <p className="mb-5 flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 bg-primary" /> Sedang tayang di CineReserve</p>
            <h1 className="max-w-[12ch] text-balance font-display text-5xl font-extrabold leading-[.88] tracking-[-.04em] sm:text-7xl lg:text-[6rem]">{movie.title}</h1>
            <p className="mt-5 font-semibold text-white/75">{movie.releaseYear} <span className="mx-2 text-white/30">/</span> {movie.ageRating} <span className="mx-2 text-white/30">/</span> {movie.genres.slice(0, 3).join(' · ')}</p>
            <p className="mt-5 line-clamp-3 max-w-xl text-base leading-7 text-white/72">{movie.synopsis}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button component={Link} to={`/movies/${movie.id}`} variant="contained" size="large" startIcon={<PlayArrow />}>Pesan tiket</Button>
              <Button component={Link} to={`/movies/${movie.id}`} variant="contained" color="secondary" size="large" startIcon={<InfoOutlined />}>Lihat detail</Button>
              <IconButton aria-label={`Tambahkan ${movie.title} ke watchlist`} className="!border !border-white/35 !text-white"><Add /></IconButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>

      <div className="absolute bottom-7 left-0 right-0">
        <Container maxWidth="xl" className="flex items-end gap-4">
          <div className="poster-rail ml-auto flex max-w-[760px] gap-2 overflow-x-auto pb-2" role="group" aria-label="Pilih film unggulan">
            {movies.map((item, index) => <button key={item.id} type="button" onClick={() => select(index)} aria-label={`Tampilkan ${item.title}`} aria-current={index === active} className={`relative h-20 w-14 shrink-0 overflow-hidden border-2 transition duration-300 sm:h-28 sm:w-20 ${index === active ? 'border-primary opacity-100' : 'border-transparent opacity-55 hover:opacity-100'}`}><img src={item.posterUrl} alt="" className="h-full w-full object-cover" /></button>)}
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <IconButton aria-label="Film sebelumnya" onClick={() => select(active - 1)} color="inherit"><ArrowBack /></IconButton>
            <IconButton aria-label="Film berikutnya" onClick={() => select(active + 1)} color="inherit"><ArrowForward /></IconButton>
            {showVideo && <VolumeOff fontSize="small" className="ml-2 text-white/60" aria-label="Preview tanpa suara" />}
          </div>
        </Container>
        <div className="mt-4 h-[3px] bg-white/15"><motion.div key={movie.id} className="h-full origin-left bg-primary" initial={{ scaleX: 0 }} animate={{ scaleX: reduceMotion ? 0 : 1 }} transition={{ duration: SLIDE_TIME / 1000, ease: 'linear' }} /></div>
      </div>
    </section>
  )
}
