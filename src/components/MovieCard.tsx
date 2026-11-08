import { StarRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import type { Movie } from '../types/domain'
import { motion } from 'motion/react'

export function MovieCard({ movie, compact = false }: { movie: Movie; compact?: boolean }) {
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}>
      <Link to={`/movies/${movie.id}`} className="group block text-white no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        <div className={`relative overflow-hidden bg-surface ${compact ? 'aspect-[4/5]' : 'aspect-[2/3]'}`}>
          <img src={movie.posterUrl} alt={`Poster ${movie.title}`} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 transition group-hover:opacity-100" />
          <div className="absolute right-3 top-3 bg-black/75 px-2 py-1 text-xs font-bold">{movie.showtimes[0]?.format ?? movie.releaseYear}</div>
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 transition duration-300 group-hover:translate-y-0">
            <h3 className="font-display text-lg font-bold leading-tight">{movie.title}</h3>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/70"><StarRounded className="!text-sm text-primary" /> {movie.rating}<span aria-hidden="true">•</span>{movie.genres.slice(0, 2).join(' / ') || 'Film'}</div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
