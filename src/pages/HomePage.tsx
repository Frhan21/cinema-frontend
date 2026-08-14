import { Link, useSearchParams } from 'react-router-dom'
import { Alert, Button, Chip, Container } from '@mui/material'
import { ArrowForward, Search } from '@mui/icons-material'
import { useMovieSearch, useMovies } from '../hooks/use-cinema'
import { useDebouncedValue } from '../hooks/use-debounced-value'
import { MovieCard } from '../components/MovieCard'
import { ErrorView, MovieGridSkeleton } from '../components/StateViews'
import { PageReveal, Reveal } from '../components/Motion'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const setSearch = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }
  const debouncedSearch = useDebouncedValue(search.trim())
  const query = useMovies()
  const searchQuery = useMovieSearch(debouncedSearch)
  if (query.isLoading) return <Container maxWidth="xl" className="py-20"><MovieGridSkeleton /></Container>
  if (query.isError) return <ErrorView message={query.error.message} retry={() => void query.refetch()} />
  const [featured, ...rest] = query.data ?? []
  if (!featured) return <ErrorView message="No movies are available yet." />
  const isSearching = debouncedSearch.length >= 2
  const displayedMovies = isSearching ? searchQuery.data ?? [] : [featured, ...rest]

  return (
    <PageReveal>
      <section className="relative min-h-[650px] overflow-hidden">
        <img src={featured.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d0e0f_0%,rgba(13,14,15,.82)_38%,rgba(13,14,15,.18)_72%),linear-gradient(0deg,#0d0e0f_0%,transparent_45%)]" />
        <Container maxWidth="xl" className="relative flex min-h-[650px] items-center py-24">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-2"><Chip label="Now playing" color="primary" size="small" /><span className="eyebrow">Powered by TMDB</span></div>
            <h1 className="max-w-xl font-display text-5xl font-extrabold leading-[.96] tracking-[-.05em] sm:text-7xl">{featured.title}</h1>
            <p className="mt-5 text-sm font-semibold text-white/65">{featured.genres.join(' / ')} · {featured.releaseYear} · Rating {featured.rating}/5</p>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70">{featured.synopsis}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button component={Link} to={`/movies/${featured.id}`} variant="contained">View details</Button>
              <Button component={Link} to="#movies" variant="outlined" color="inherit">Explore movies</Button>
            </div>
          </div>
        </Container>
      </section>

      <Container maxWidth="xl" className="pb-20">
        <div className="-mt-8 mb-16 flex items-center rounded-xl border border-white/10 bg-surface/95 px-4 py-2 shadow-2xl backdrop-blur-xl focus-within:border-secondary/70">
          <Search className="text-white/40" /><label htmlFor="movie-search" className="sr-only">Search movies</label><input id="movie-search" value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/35" placeholder="Search TMDB movies…" autoComplete="off" /><Button color="inherit" onClick={() => setSearch('')} disabled={!search}>Clear</Button>
        </div>
        <Reveal><section id="movies">
          <div className="mb-6 flex items-end justify-between"><div><p className="eyebrow text-primary">{isSearching ? `${searchQuery.data?.length ?? 0} results` : 'Curated today'}</p><h2 className="font-display text-3xl font-bold">{isSearching ? `Search: “${debouncedSearch}”` : 'Now Playing'}</h2></div>{!isSearching && <Button endIcon={<ArrowForward />} color="inherit">View all</Button>}</div>
          {searchQuery.isError ? <Alert severity="error" action={<Button color="inherit" onClick={() => void searchQuery.refetch()}>Retry</Button>}>Movie search could not be completed.</Alert> : searchQuery.isFetching ? <MovieGridSkeleton /> : displayedMovies.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{displayedMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div> : <div className="rounded-xl border border-dashed border-white/15 px-6 py-14 text-center"><h3 className="font-display text-xl font-bold">No matching movies</h3><p className="mt-2 text-sm text-white/50">Try a shorter title or check the spelling.</p><Button className="!mt-5" onClick={() => setSearch('')}>Show now playing</Button></div>}
        </section></Reveal>
        {!isSearching && <Reveal><section className="mt-20"><p className="eyebrow text-primary">Audience favorites</p><h2 className="mb-6 font-display text-3xl font-bold">Trending This Week</h2><div className="grid gap-4 md:grid-cols-3">{[featured, ...rest].slice(0, 3).map((movie) => <MovieCard key={movie.id} movie={movie} compact />)}</div></section></Reveal>}
      </Container>
    </PageReveal>
  )
}
