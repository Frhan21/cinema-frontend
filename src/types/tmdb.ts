export interface TmdbPagedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TmdbMovieSummary {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  genre_ids: number[]
  release_date: string
  vote_average: number
}

export interface TmdbGenre {
  id: number
  name: string
}

interface TmdbCredit {
  id: number
  name: string
  job?: string
  profile_path: string | null
}

interface TmdbCastCredit extends TmdbCredit {
  character: string
  order: number
}

interface TmdbVideo {
  key: string
  site: string
  type: string
  official: boolean
}

interface TmdbReleaseDate {
  certification: string
  type: number
}

export interface TmdbMovieDetails extends Omit<TmdbMovieSummary, 'genre_ids'> {
  runtime: number | null
  tagline: string
  genres: TmdbGenre[]
  credits?: { crew: TmdbCredit[]; cast: TmdbCastCredit[] }
  videos?: { results: TmdbVideo[] }
  release_dates?: { results: Array<{ iso_3166_1: string; release_dates: TmdbReleaseDate[] }> }
}
