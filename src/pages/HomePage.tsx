import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Alert, Button, Chip, Container } from '@mui/material'
import { ArrowForward, Search } from '@mui/icons-material'
import { useFeaturedMovies, useGenreMovieRails, useMovieSearch, useMovies } from '../hooks/use-cinema'
import { useDebouncedValue } from '../hooks/use-debounced-value'
import { MovieCard } from '../components/MovieCard'
import { ErrorView, MovieGridSkeleton } from '../components/StateViews'
import { PageReveal, Reveal } from '../components/Motion'
import { HeroCarousel } from '../components/HeroCarousel'
import { MovieRail, MovieRailSkeleton } from '../components/MovieRail'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const search = searchParams.get('q') ?? ''
  const setSearch = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }
  const debouncedSearch = useDebouncedValue(search.trim())
  const query = useMovies()
  const featuredQuery = useFeaturedMovies()
  const genreRailsQuery = useGenreMovieRails()
  const searchQuery = useMovieSearch(debouncedSearch)
  if (query.isLoading) return <Container maxWidth="xl" className="py-20"><MovieGridSkeleton /></Container>
  if (query.isError) return <ErrorView message={query.error.message} retry={() => void query.refetch()} />
  const movies = query.data ?? []
  if (!movies.length) return <ErrorView message="Belum ada film yang tersedia." />
  const isSearching = debouncedSearch.length >= 2
  const displayedMovies = isSearching ? searchQuery.data ?? [] : movies
  const heroMovies = featuredQuery.data?.length ? featuredQuery.data : movies.slice(0, 5)
  const genreRails = genreRailsQuery.data ?? []
  const activeGenre = genreRails.find((rail) => rail.id === selectedGenre)
  const railTitle = activeGenre?.name ?? 'Sedang tayang'
  const railMovies = activeGenre?.movies ?? movies

  return <PageReveal>
    <HeroCarousel movies={heroMovies} />
    <Container maxWidth="xl" className="pb-24">
      <Reveal className="relative z-10 -mt-1 mb-20 pt-12"><div className="flex items-center border-b-2 border-white/25 px-1 focus-within:border-primary"><Search className="text-white/50" /><label htmlFor="movie-search" className="sr-only">Cari film</label><input id="movie-search" value={search} onChange={(event) => setSearch(event.target.value)} className="h-16 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-white/40" placeholder="Cari judul film di TMDB" autoComplete="off" /><Button color="inherit" onClick={() => setSearch('')} disabled={!search}>Hapus</Button></div></Reveal>

      <div id="movies">
        {isSearching ? <Reveal><section><div className="mb-8"><h2 className="font-display text-3xl font-bold sm:text-5xl">Hasil untuk “{debouncedSearch}”</h2><p className="mt-2 text-sm text-white/55">{searchQuery.data?.length ?? 0} film ditemukan</p></div>{searchQuery.isError ? <Alert severity="error" action={<Button color="inherit" onClick={() => void searchQuery.refetch()}>Coba lagi</Button>}>Pencarian film tidak dapat diselesaikan.</Alert> : searchQuery.isFetching ? <MovieGridSkeleton /> : displayedMovies.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">{displayedMovies.map((movie, index) => <Reveal key={movie.id} delay={Math.min(index, 5) * 0.045}><MovieCard movie={movie} /></Reveal>)}</div> : <div className="bg-surface px-6 py-16 text-center"><h3 className="font-display text-2xl font-bold">Film tidak ditemukan</h3><p className="mt-2 text-sm text-white/55">Coba judul yang lebih pendek atau periksa ejaannya.</p><Button className="!mt-6" onClick={() => setSearch('')}>Kembali ke film tayang</Button></div>}</section></Reveal> : <Reveal><section><div className="poster-rail mb-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filter genre"><Chip label="Sedang tayang" clickable color={selectedGenre === null ? 'primary' : 'default'} variant={selectedGenre === null ? 'filled' : 'outlined'} aria-pressed={selectedGenre === null} onClick={() => setSelectedGenre(null)} />{genreRails.map((rail) => <Chip key={rail.id} label={rail.name} clickable color={selectedGenre === rail.id ? 'primary' : 'default'} variant={selectedGenre === rail.id ? 'filled' : 'outlined'} aria-pressed={selectedGenre === rail.id} onClick={() => setSelectedGenre(rail.id)} />)}</div>{genreRailsQuery.isLoading && selectedGenre !== null ? <MovieRailSkeleton /> : <MovieRail title={railTitle} description={activeGenre ? `Pilihan film ${activeGenre.name.toLowerCase()} populer dari TMDB.` : 'Geser untuk melihat semua film yang tersedia sekarang.'} movies={railMovies} />}{genreRailsQuery.isError && <Alert severity="warning" className="!mt-6" action={<Button color="inherit" onClick={() => void genreRailsQuery.refetch()}>Coba lagi</Button>}>Filter genre belum dapat dimuat. Film sedang tayang tetap tersedia.</Alert>}</section></Reveal>}
      </div>

      {!isSearching && <Reveal><section className="mt-28 grid items-center gap-10 bg-[#101010] p-6 md:grid-cols-[1.1fr_.9fr] md:p-12"><div className="grid grid-cols-3 gap-2">{movies.slice(0, 3).map((movie, index) => <img key={movie.id} src={movie.posterUrl} alt={`Poster ${movie.title}`} className={`w-full object-cover ${index === 1 ? 'mt-10' : ''}`} />)}</div><div><h2 className="max-w-md font-display text-4xl font-bold leading-[.95] sm:text-5xl">Satu malam. Banyak cerita.</h2><p className="mt-6 max-w-lg leading-7 text-white/65">Jelajahi film pilihan, cek jadwal yang tersedia, dan lanjutkan langsung ke pemilihan kursi.</p><Button component={Link} to="#movies" variant="contained" className="!mt-8" endIcon={<ArrowForward />}>Temukan film</Button></div></section></Reveal>}
    </Container>
  </PageReveal>
}
