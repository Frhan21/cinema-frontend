import { Login, Logout, Menu as MenuIcon, MovieFilter, NotificationsNone, Search } from '@mui/icons-material'
import { AppBar, Avatar, Box, Button, Container, Drawer, IconButton, Menu, MenuItem, Toolbar } from '@mui/material'
import { useState, type FormEvent, type MouseEvent, type PropsWithChildren } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'

const links = [
  ['Home', '/'],
  ['Movies', '/#movies'],
  ['Theaters', '/#theaters'],
  ['Promotions', '/#promotions'],
] as const

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navSearch, setNavSearch] = useState('')
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const initials = user?.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  const openProfile = (event: MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget)
  const closeProfile = () => setProfileAnchor(null)
  const signOut = () => { logout(); closeProfile(); navigate('/') }
  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    const query = navSearch.trim()
    if (query) navigate(`/?q=${encodeURIComponent(query)}#movies`)
  }

  return (
    <Box className="min-h-screen bg-cinema text-white">
      <AppBar position="sticky" elevation={0} color="transparent" className="border-b border-white/10 bg-black/75 backdrop-blur-xl">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="h-[72px] gap-5">
            <Link to="/" className="flex shrink-0 items-center gap-2 text-white no-underline" aria-label="CineReserve home">
              <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[#240506]"><MovieFilter fontSize="small" /></span>
              <strong className="font-display text-base tracking-tight">CineReserve</strong>
            </Link>

            <Box component="nav" aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
              {links.map(([label, href]) => (
                <NavLink key={label} to={href} className="rounded-md px-3 py-2 text-xs font-semibold text-white/75 no-underline transition hover:text-white">
                  {label}
                </NavLink>
              ))}
            </Box>

            <Box component="form" onSubmit={submitSearch} className="ml-auto hidden h-10 min-w-64 items-center gap-2 rounded-lg border border-white/10 bg-white/[.06] px-3 focus-within:border-secondary/60 lg:flex">
              <Search fontSize="small" className="text-white/50" />
              <input value={navSearch} onChange={(event) => setNavSearch(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40" placeholder="Search movies..." aria-label="Search movies" />
            </Box>

            {isAuthenticated ? <><IconButton aria-label="Notifications" color="inherit"><NotificationsNone fontSize="small" /></IconButton><IconButton aria-label="Open account menu" color="inherit" onClick={openProfile}><Avatar sx={{ width: 32, height: 32, bgcolor: '#ff5f62', color: '#1a0506', fontSize: 12, fontWeight: 800 }}>{initials}</Avatar></IconButton><Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={closeProfile}><MenuItem component={Link} to="/dashboard" onClick={closeProfile}>My profile</MenuItem><MenuItem component={Link} to="/tickets" onClick={closeProfile}>My tickets</MenuItem>{user?.role === 'admin' && <MenuItem component={Link} to="/admin" onClick={closeProfile}>Admin panel</MenuItem>}<MenuItem onClick={signOut}><Logout fontSize="small" className="mr-2" /> Sign out</MenuItem></Menu></> : <Button component={Link} to="/login" variant="contained" size="small" startIcon={<Login />}>Login</Button>}
            <IconButton aria-label="Open navigation" color="inherit" className="md:!hidden" onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box className="flex h-full w-72 flex-col gap-2 bg-[#111315] p-6 pt-10">
          {links.map(([label, href]) => <Button key={label} component={Link} to={href} color="inherit" onClick={() => setDrawerOpen(false)}>{label}</Button>)}
          {isAuthenticated ? <><Button component={Link} to="/tickets" color="inherit" onClick={() => setDrawerOpen(false)}>My Tickets</Button><Button component={Link} to="/dashboard" color="inherit" onClick={() => setDrawerOpen(false)}>Dashboard</Button><Button color="inherit" startIcon={<Logout />} onClick={() => { setDrawerOpen(false); signOut() }}>Sign out</Button></> : <Button component={Link} to="/login" variant="contained" startIcon={<Login />} onClick={() => setDrawerOpen(false)}>Login</Button>}
        </Box>
      </Drawer>

      <main>{children}</main>
      <footer className="border-t border-white/10 bg-[#090a0b] py-12">
        <Container maxWidth="xl">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
            <div><div className="mb-3 flex items-center gap-2 font-display font-bold"><MovieFilter color="primary" /> CineReserve</div><p className="max-w-xs text-sm leading-6 text-white/55">The premium cinematic experience at your fingertips. Reserve your front-row seat to the magic.</p></div>
            <div><p className="eyebrow">Legal</p><p className="footer-copy">Terms of Service<br />Privacy Policy<br />Cookie Policy</p></div>
            <div><p className="eyebrow">Connect</p><p className="footer-copy">Instagram<br />YouTube<br />Community</p></div>
            <div><p className="eyebrow">Newsletter</p><div className="flex gap-2"><input className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none" placeholder="Enter your email" /><Button variant="contained">Join</Button></div></div>
          </div>
          <div className="mt-10 flex flex-col gap-2 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 CineReserve Global. All rights reserved.</p><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div>
        </Container>
      </footer>
    </Box>
  )
}
