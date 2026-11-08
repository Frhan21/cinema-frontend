import { tmdbService } from './tmdb-service'

export const cinemaService = {
  async getMovies() {
    return (await tmdbService.getNowPlaying()).movies
  },
  async getFeaturedMovies() {
    return tmdbService.getFeatured(5)
  },
  async getGenreRails() {
    return tmdbService.getGenreRails(5)
  },
  async searchMovies(query: string) {
    return (await tmdbService.searchMovies(query)).movies
  },
  async getMovie(id: string) {
    return tmdbService.getMovie(id)
  },
}
