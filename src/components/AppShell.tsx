import { Close, Login, Logout, Menu as MenuIcon, MovieFilter, Search } from '@mui/icons-material'
import { AppBar, Avatar, Box, Button, Container, Drawer, IconButton, Menu, MenuItem, Toolbar } from '@mui/material'
import { useEffect, useState, type FormEvent, type MouseEvent, type PropsWithChildren } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'

const links = [['Beranda', '/'], ['Film', '/#movies'], ['Tiket saya', '/tickets']] as const

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navSearch, setNavSearch] = useState('')
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const initials = user?.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const closeProfile = () => setProfileAnchor(null)
  const signOut = () => { logout(); closeProfile(); navigate('/') }
  const submitSearch = (event: FormEvent) => { event.preventDefault(); const query = navSearch.trim(); if (query) { navigate(`/?q=${encodeURIComponent(query)}#movies`); setDrawerOpen(false) } }
  const isHome = location.pathname === '/'

  return (
    <Box className="min-h-screen bg-cinema text-white">
      <a href="#main-content" className="fixed left-4 top-3 z-[2000] -translate-y-20 bg-white px-4 py-3 font-bold text-black transition focus:translate-y-0">Lewati ke konten</a>
      <AppBar position="fixed" elevation={0} color="transparent" className={`transition-colors duration-300 ${scrolled || !isHome ? 'bg-black/95' : 'bg-gradient-to-b from-black/85 to-transparent'}`}>
        <Container maxWidth="xl"><Toolbar disableGutters className="h-[72px] gap-5">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-white no-underline" aria-label="Beranda CineReserve"><span className="grid h-9 w-9 place-items-center bg-primary"><MovieFilter fontSize="small" /></span><strong className="font-display text-xl font-extrabold tracking-[-.045em]">CINE<span className="text-primary">RESERVE</span></strong></Link>
          <Box component="nav" aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">{links.map(([label, href]) => <NavLink key={label} to={href} className={({ isActive }) => `px-3 py-3 text-sm font-bold no-underline transition ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`}>{label}</NavLink>)}</Box>
          <Box component="form" onSubmit={submitSearch} className="ml-auto hidden h-11 min-w-64 items-center gap-2 border-b border-white/35 px-2 focus-within:border-white lg:flex"><Search fontSize="small" className="text-white/55" /><input value={navSearch} onChange={(event) => setNavSearch(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50" placeholder="Cari film" aria-label="Cari film" /></Box>
          {isAuthenticated ? <><IconButton aria-label="Buka menu akun" color="inherit" onClick={(event: MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget)}><Avatar sx={{ width: 34, height: 34, bgcolor: '#E50914', color: '#fff', fontSize: 12, fontWeight: 800 }}>{initials}</Avatar></IconButton><Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={closeProfile}><MenuItem component={Link} to="/dashboard" onClick={closeProfile}>Profil saya</MenuItem><MenuItem component={Link} to="/tickets" onClick={closeProfile}>Tiket saya</MenuItem>{user?.role === 'admin' && <MenuItem component={Link} to="/admin" onClick={closeProfile}>Panel admin</MenuItem>}<MenuItem onClick={signOut}><Logout fontSize="small" className="mr-2" /> Keluar</MenuItem></Menu></> : <Button component={Link} to="/login" variant="contained" size="small" startIcon={<Login />}>Masuk</Button>}
          <IconButton aria-label="Buka navigasi" color="inherit" className="md:!hidden" onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
        </Toolbar></Container>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}><Box className="flex h-full w-[min(88vw,340px)] flex-col gap-3 bg-[#0b0b0b] p-6 pt-5"><div className="mb-5 flex items-center justify-between"><strong className="font-display text-lg">Menu</strong><IconButton aria-label="Tutup navigasi" color="inherit" onClick={() => setDrawerOpen(false)}><Close /></IconButton></div><Box component="form" onSubmit={submitSearch} className="mb-4 flex items-center border-b border-white/30"><Search className="text-white/50" /><input value={navSearch} onChange={(event) => setNavSearch(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent px-3 outline-none" placeholder="Cari film" aria-label="Cari film" /></Box>{links.map(([label, href]) => <Button key={label} component={Link} to={href} color="inherit" className="!justify-start" onClick={() => setDrawerOpen(false)}>{label}</Button>)}{isAuthenticated && <Button component={Link} to="/dashboard" color="inherit" className="!justify-start" onClick={() => setDrawerOpen(false)}>Dashboard</Button>}</Box></Drawer>
      <main id="main-content" className={isHome ? '' : 'pt-[72px]'}>{children}</main>
      <footer className="bg-[#0b0b0b] py-14"><Container maxWidth="xl"><div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]"><div><div className="font-display text-2xl font-extrabold">CINE<span className="text-primary">RESERVE</span></div><p className="mt-4 max-w-sm text-sm leading-7 text-white/60">Temukan film yang sedang tayang, pilih jadwal dan kursi, lalu simpan tiketmu dalam satu pengalaman.</p></div><nav aria-label="Tautan footer"><h2 className="font-display text-lg font-bold">Jelajahi</h2><div className="mt-4 flex flex-col gap-3 text-sm text-white/60"><Link to="/#movies">Film</Link><Link to="/tickets">Tiket saya</Link><Link to="/dashboard">Akun</Link></div></nav><div><h2 className="font-display text-lg font-bold">Tentang data film</h2><p className="mt-4 text-sm leading-7 text-white/60">Produk ini menggunakan TMDB API, tetapi tidak didukung atau disertifikasi oleh TMDB.</p></div></div><p className="mt-14 text-xs text-white/45">© 2026 CineReserve.</p></Container></footer>
    </Box>
  )
}
