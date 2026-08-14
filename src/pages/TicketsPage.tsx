import { Link, useSearchParams } from 'react-router-dom'
import { Alert, Button, Chip, Container, Tab, Tabs } from '@mui/material'
import { AccessTime, ConfirmationNumber, Payments } from '@mui/icons-material'
import { useState } from 'react'
import { useTickets } from '../hooks/use-cinema'
import { ErrorView, LoadingView } from '../components/StateViews'
import { MotionArticle, PageReveal } from '../components/Motion'

export function TicketsPage() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(0)
  const query = useTickets()
  if (query.isLoading) return <LoadingView />
  if (query.isError) return <ErrorView message={query.error.message} retry={() => void query.refetch()} />
  const filtered = query.data?.filter((transaction) => tab === 0 ? transaction.payment_status === 'pending' : transaction.payment_status !== 'pending') ?? []

  return <PageReveal><Container maxWidth="xl" className="min-h-[70vh] py-14"><p className="eyebrow text-primary">Booking archive</p><h1 className="font-display text-4xl font-extrabold md:text-5xl">Your Transactions</h1><p className="mt-2 text-sm text-white/55">Payment status comes directly from the Cinema Ticketing API.</p>{params.get('payment') === 'success' && <Alert severity="success" className="!mt-6">The booking was submitted. Verify its latest payment state below.</Alert>}<Tabs value={tab} onChange={(_, value: number) => setTab(value)} className="!mt-7 !border-b !border-white/10"><Tab label="Pending" /><Tab label="Completed & cancelled" /></Tabs><div className="mt-7 grid gap-4 md:grid-cols-2">{filtered.length ? filtered.map((transaction, index) => <MotionArticle key={transaction.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-xl border border-white/10 bg-surface p-6"><div className="flex items-start justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><ConfirmationNumber /></span><Chip label={transaction.payment_status} color={transaction.payment_status === 'paid' ? 'success' : transaction.payment_status === 'cancelled' ? 'error' : 'warning'} size="small" /></div><strong className="mt-5 block font-display text-2xl">Rp{transaction.total_price.toLocaleString('id-ID')}</strong><p className="mt-2 flex items-center gap-2 text-sm text-white/45"><AccessTime fontSize="small" /> {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(transaction.created_at))}</p><p className="mt-3 truncate font-mono text-xs text-white/35">{transaction.id}</p><Button component={Link} to={`/payment/status/${transaction.id}`} fullWidth variant={transaction.payment_status === 'pending' ? 'contained' : 'outlined'} startIcon={<Payments />} className="!mt-6">{transaction.payment_status === 'pending' ? 'Continue payment' : 'View transaction'}</Button></MotionArticle>) : <div className="col-span-full rounded-xl border border-dashed border-white/15 py-16 text-center"><h2 className="font-display text-xl font-bold">Nothing here yet</h2><p className="mt-2 text-sm text-white/45">Transactions in this state will appear here.</p></div>}</div></Container></PageReveal>
}
