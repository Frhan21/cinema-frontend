import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Container, TextField } from '@mui/material'
import { Login, MovieFilter } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth-service'
import { useAuthStore } from '../stores/auth-store'
import { PageReveal } from '../components/Motion'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((state) => state.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      setSession(session)
      const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard'
      navigate(destination, { replace: true })
    },
  })
  const sessionExpired = new URLSearchParams(location.search).get('reason') === 'session-expired'

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!email || password.length < 6) return
    mutation.mutate({ email, password })
  }

  return <PageReveal><Container maxWidth="sm" className="py-16 md:py-24"><form onSubmit={submit} className="rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl sm:p-9"><div className="mb-8 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-black"><MovieFilter /></span><div><p className="eyebrow text-primary">Welcome back</p><h1 className="font-display text-3xl font-extrabold">Sign in</h1></div></div>{sessionExpired && <Alert severity="warning" className="!mb-5">Your session expired. Please sign in again.</Alert>}{mutation.isError && <Alert severity="error" className="!mb-5">{mutation.error.message}</Alert>}<div className="space-y-5"><TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" fullWidth required /><TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" helperText="Minimum 6 characters" inputProps={{ minLength: 6 }} fullWidth required /></div><Button type="submit" variant="contained" fullWidth size="large" startIcon={<Login />} loading={mutation.isPending} className="!mt-7">Sign in</Button><p className="mt-6 text-center text-sm text-white/55">New to CineReserve? <Link to="/register" className="font-semibold text-primary">Create an account</Link></p></form></Container></PageReveal>
}
