import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Container, TextField } from '@mui/material'
import { PersonAdd } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth-service'
import { useAuthStore } from '../stores/auth-store'
import { PageReveal } from '../components/Motion'

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const mismatch = Boolean(form.confirmPassword && form.password !== form.confirmPassword)
  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (session) => { setSession(session); navigate('/dashboard', { replace: true }) },
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (mismatch || form.password.length < 6) return
    mutation.mutate({ name: form.name, email: form.email, password: form.password, confirm_password: form.confirmPassword })
  }

  return <PageReveal><Container maxWidth="sm" className="py-16"><form onSubmit={submit} className="rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl sm:p-9"><p className="eyebrow text-primary">Join the audience</p><h1 className="mt-2 font-display text-3xl font-extrabold">Create account</h1><p className="mt-2 text-sm text-white/50">Reserve seats, manage payments, and keep your ticket history.</p>{mutation.isError && <Alert severity="error" className="!mt-5">{mutation.error.message}</Alert>}<div className="mt-7 space-y-5"><TextField label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" fullWidth required /><TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" fullWidth required /><TextField label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="new-password" inputProps={{ minLength: 6 }} fullWidth required /><TextField label="Confirm password" type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} autoComplete="new-password" error={mismatch} helperText={mismatch ? 'Passwords do not match' : 'Minimum 6 characters'} fullWidth required /></div><Button type="submit" variant="contained" fullWidth size="large" startIcon={<PersonAdd />} loading={mutation.isPending} disabled={mismatch} className="!mt-7">Create account</Button><p className="mt-6 text-center text-sm text-white/55">Already registered? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p></form></Container></PageReveal>
}
