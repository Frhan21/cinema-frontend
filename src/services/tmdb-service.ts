import type { Movie, MovieCollection } from '../types/domain'
import type { TmdbGenre, TmdbMovieDetails, TmdbMovieSummary, TmdbPagedResponse } from '../types/tmdb'
import { tmdbClient } from '../lib/tmdb-client'

const imageBase = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'
const fallbackBackdrop = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80'
const fallbackPoster = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80'

const imageUrl = (path: string | null, size: 'w500' | 'w1280') =>
  path ? `${imageBase}/${size}${path}` : size === 'w500' ? fallbackPoster : fallbackBackdrop

const yearFrom = (date: string) => {
  const year = Number(date.slice(0, 4))
  return Number.isFinite(year) ? year : new Date().getFullYear()
}

const mapSummary = (movie: TmdbMovieSummary, genres: Map<number, string>): Movie => ({
  id: String(movie.id),
  title: movie.title,
  synopsis: movie.overview || 'Synopsis is not available for this movie yet.',
  posterUrl: imageUrl(movie.poster_path, 'w500'),
  backdropUrl: imageUrl(movie.backdrop_path, 'w1280'),
  genres: movie.genre_ids.map((id) => genres.get(id)).filter((name): name is string => Boolean(name)),
  durationMinutes: 0,
  rating: Number((movie.vote_average / 2).toFixed(1)),
  ageRating: 'NR',
  releaseYear: yearFrom(movie.release_date),
  director: 'To be announced',
  showtimes: [],
})

const certification = (movie: TmdbMovieDetails) => {
  const region = movie.release_dates?.results.find((item) => item.iso_3166_1 === 'ID')
    ?? movie.release_dates?.results.find((item) => item.iso_3166_1 === 'US')
  return region?.release_dates.find((item) => item.certification)?.certification || 'NR'
}

export const tmdbService = {
  async getGenres(): Promise<Map<number, string>> {
    const response = await tmdbClient.get<{ genres: TmdbGenre[] }>('/genre/movie/list', { params: { language: 'id-ID' } })
    return new Map(response.data.genres.map((genre) => [genre.id, genre.name]))
  },

  async getNowPlaying(page = 1): Promise<MovieCollection> {
    const [moviesResponse, genres] = await Promise.all([
      tmdbClient.get<TmdbPagedResponse<TmdbMovieSummary>>('/movie/now_playing', { params: { language: 'id-ID', region: 'ID', page } }),
      this.getGenres(),
    ])
    return {
      movies: moviesResponse.data.results.map((movie) => mapSummary(movie, genres)),
      page: moviesResponse.data.page,
      totalPages: moviesResponse.data.total_pages,
      totalResults: moviesResponse.data.total_results,
    }
  },

  async searchMovies(query: string, page = 1): Promise<MovieCollection> {
    const [moviesResponse, genres] = await Promise.all([
      tmdbClient.get<TmdbPagedResponse<TmdbMovieSummary>>('/search/movie', { params: { query, language: 'id-ID', include_adult: false, page } }),
      this.getGenres(),
    ])
    return {
      movies: moviesResponse.data.results.map((movie) => mapSummary(movie, genres)),
      page: moviesResponse.data.page,
      totalPages: moviesResponse.data.total_pages,
      totalResults: moviesResponse.data.total_results,
    }
  },

  async getMovie(id: string): Promise<Movie> {
    const response = await tmdbClient.get<TmdbMovieDetails>(`/movie/${id}`, {
      params: { language: 'id-ID', append_to_response: 'credits,videos,release_dates', include_video_language: 'id,null,en' },
    })
    const movie = response.data
    const trailer = movie.videos?.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official)
      ?? movie.videos?.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer')
    return {
      id: String(movie.id),
      title: movie.title,
      synopsis: movie.overview || 'Synopsis is not available for this movie yet.',
      posterUrl: imageUrl(movie.poster_path, 'w500'),
      backdropUrl: imageUrl(movie.backdrop_path, 'w1280'),
      genres: movie.genres.map((genre) => genre.name),
      durationMinutes: movie.runtime ?? 0,
      rating: Number((movie.vote_average / 2).toFixed(1)),
      ageRating: certification(movie),
      releaseYear: yearFrom(movie.release_date),
      director: movie.credits?.crew.find((credit) => credit.job === 'Director')?.name ?? 'To be announced',
      trailerKey: trailer?.key,
      tagline: movie.tagline,
      showtimes: [],
    }
  },
}
