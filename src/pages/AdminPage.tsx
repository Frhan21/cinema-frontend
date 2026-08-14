import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Alert, Button, Container, Skeleton, Tab, Tabs } from '@mui/material'
import { Add, AttachMoney, ConfirmationNumber, LocalActivity, Movie, Weekend } from '@mui/icons-material'
import { adminService } from '../services/admin-service'
import { MovieManager } from '../components/admin/MovieManager'
import { StudioManager } from '../components/admin/StudioManager'
import { SeatManager } from '../components/admin/SeatManager'
import { ScheduleManager } from '../components/admin/ScheduleManager'
import { PromoManager } from '../components/admin/PromoManager'
import { PageReveal } from '../components/Motion'

type AdminSection = 'overview' | 'movies' | 'studios' | 'seats' | 'schedules' | 'promos'
const sections: Array<{ value: AdminSection; label: string }> = [
  { value: 'overview', label: 'Overview' },
  { value: 'movies', label: 'Movies' },
  { value: 'studios', label: 'Studios' },
  { value: 'seats', label: 'Seats' },
  { value: 'schedules', label: 'Schedules' },
  { value: 'promos', label: 'Promos' },
]

const localDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())

export function AdminPage() {
  const [section, setSection] = useState<AdminSection>('overview')
  const [importOpen, setImportOpen] = useState(false)
  const [reportDate] = useState(localDate)
  const reportQuery = useQuery({ queryKey: ['admin', 'report', 'daily', reportDate], queryFn: () => adminService.reports.daily(reportDate), enabled: section === 'overview' })
  const openRelease = () => { setSection('movies'); setImportOpen(true) }

  return <PageReveal><Container maxWidth="xl" className="py-10 md:py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-primary">Operations console</p><h1 className="font-display text-4xl font-extrabold">Admin Panel</h1><p className="mt-2 text-sm text-white/50">Manage catalog, venues, programming, and campaigns.</p></div><Button variant="contained" startIcon={<Add />} onClick={openRelease}>New release</Button></div><div className="mt-8 overflow-x-auto border-b border-white/10"><Tabs value={section} onChange={(_, value: AdminSection) => setSection(value)} variant="scrollable" scrollButtons="auto">{sections.map((item) => <Tab key={item.value} value={item.value} label={item.label} />)}</Tabs></div><div className="mt-7">{section === 'overview' && <section>{reportQuery.isError && <Alert severity="warning" className="!mb-5">Daily report could not be loaded: {reportQuery.error.message}</Alert>}<div className="grid gap-4 md:grid-cols-3">{reportQuery.isLoading ? Array.from({ length: 3 }, (_, index) => <Skeleton key={index} variant="rounded" height={132} className="!bg-white/[.06]" />) : <><article className="rounded-xl border border-white/10 bg-surface p-5"><div className="flex justify-between"><span className="eyebrow">Today revenue</span><AttachMoney className="text-primary" /></div><strong className="mt-4 block font-display text-3xl">Rp{(reportQuery.data?.total_revenue ?? 0).toLocaleString('id-ID')}</strong><p className="mt-2 text-xs text-white/40">Backend verified paid transactions</p></article><article className="rounded-xl border border-white/10 bg-surface p-5"><div className="flex justify-between"><span className="eyebrow">Tickets sold</span><ConfirmationNumber className="text-secondary" /></div><strong className="mt-4 block font-display text-3xl">{reportQuery.data?.total_tickets_sold ?? 0}</strong><p className="mt-2 text-xs text-white/40">For {reportDate}</p></article><article className="rounded-xl border border-white/10 bg-surface p-5"><div className="flex justify-between"><span className="eyebrow">Management</span><LocalActivity className="text-primary" /></div><strong className="mt-4 block font-display text-3xl">5 modules</strong><p className="mt-2 text-xs text-white/40">Catalog to campaign operations</p></article></>}</div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
          { value: 'movies' as const, icon: Movie, title: 'Movies', copy: 'Import a TMDB release or maintain manual movie records.' },
          { value: 'studios' as const, icon: Weekend, title: 'Studios & seats', copy: 'Create auditoriums, facilities, capacity, and seat masters.' },
          { value: 'schedules' as const, icon: LocalActivity, title: 'Programming', copy: 'Publish future schedules with backend overlap validation.' },
        ].map(({ value, icon: Icon, title, copy }) => <button key={value} type="button" onClick={() => setSection(value)} className="rounded-xl border border-white/10 bg-surface p-6 text-left transition hover:-translate-y-1 hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><Icon className="text-primary" /><h2 className="mt-5 font-display text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-white/45">{copy}</p></button>)}</div></section>}{section === 'movies' && <MovieManager importOpen={importOpen} onImportOpen={() => setImportOpen(true)} onImportClose={() => setImportOpen(false)} />}{section === 'studios' && <StudioManager />}{section === 'seats' && <SeatManager />}{section === 'schedules' && <ScheduleManager />}{section === 'promos' && <PromoManager />}</div></Container></PageReveal>
}
