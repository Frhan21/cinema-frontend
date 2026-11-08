import { useEffect, useRef, useState } from 'react'
import { IconButton, Skeleton } from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import type { Movie } from '../types/domain'
import { MovieCard } from './MovieCard'

export function MovieRail({ title, description, movies }: { title: string; description?: string; movies: Movie[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false, overflow: false })

  const updateEdges = () => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft >= max - 4, overflow: max > 8 })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(track)
    return () => observer.disconnect()
  }, [movies.length])

  const move = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: reduced ? 'auto' : 'smooth' })
  }

  const headingId = `rail-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <section aria-labelledby={headingId} className="group/rail">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div><h2 id={headingId} className="font-display text-3xl font-bold tracking-[-.035em] sm:text-4xl">{title}</h2>{description && <p className="mt-2 text-sm text-white/55">{description}</p>}</div>
        {edges.overflow && <div className="hidden gap-1 sm:flex"><IconButton aria-label={`Geser ${title} ke kiri`} color="inherit" disabled={edges.start} onClick={() => move(-1)}><ArrowBack /></IconButton><IconButton aria-label={`Geser ${title} ke kanan`} color="inherit" disabled={edges.end} onClick={() => move(1)}><ArrowForward /></IconButton></div>}
      </div>
      <div ref={trackRef} onScroll={updateEdges} className="poster-rail -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" tabIndex={0} aria-label={`Daftar film ${title}`}>
        {movies.map((movie) => <div key={movie.id} className="w-[44vw] max-w-[210px] shrink-0 snap-start sm:w-[28vw] md:w-[21vw] lg:w-[15.5vw] xl:w-[13.5vw]"><MovieCard movie={movie} /></div>)}
      </div>
    </section>
  )
}

export function MovieRailSkeleton({ title = 'Memuat film' }: { title?: string }) {
  return <section aria-label={title} aria-busy="true"><Skeleton width={220} height={52} className="!bg-white/[.07]" /><div className="poster-rail mt-5 flex gap-3 overflow-hidden">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} variant="rectangular" className="!aspect-[2/3] !h-auto w-[44vw] max-w-[210px] shrink-0 !bg-white/[.06] sm:w-[28vw] lg:w-[15.5vw]" />)}</div></section>
}
