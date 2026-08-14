import { tmdbService } from './tmdb-service'

export const cinemaService = {
  async getMovies() {
    return (await tmdbService.getNowPlaying()).movies
  },
  async searchMovies(query: string) {
    return (await tmdbService.searchMovies(query)).movies
  },
  async getMovie(id: string) {
    return tmdbService.getMovie(id)
  },
}
