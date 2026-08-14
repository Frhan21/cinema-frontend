import { Box, Chip } from '@mui/material'
import { StarRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import type { Movie } from '../types/domain'
import { motion } from 'motion/react'

export function MovieCard({ movie, compact = false }: { movie: Movie; compact?: boolean }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.22 }}>
    <Link to={`/movies/${movie.id}`} className="group block text-white no-underline">
      <Box className={`relative overflow-hidden rounded-xl border border-white/10 bg-surface ${compact ? 'aspect-[4/5]' : 'aspect-[2/3]'}`}>
        <img src={movie.posterUrl} alt={`Poster ${movie.title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
        <Chip label={movie.showtimes[0]?.format ?? movie.releaseYear} size="small" color={movie.showtimes.length ? 'primary' : 'default'} className="!absolute left-3 top-3 !h-5 !text-[9px] !font-bold" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-base font-bold leading-tight">{movie.title}</h3>
          <div className="mt-2 flex items-center gap-2 text-xs text-white/65"><StarRounded className="!text-sm text-primary" /> {movie.rating} <span>•</span> {movie.genres.slice(0, 2).join(' / ') || 'Movie'}</div>
        </div>
      </Box>
    </Link>
    </motion.div>
  )
}
