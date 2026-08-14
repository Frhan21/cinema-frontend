import { Link, useParams } from 'react-router-dom'
import { Alert, Button, CircularProgress, Container } from '@mui/material'
import { Cancel, CheckCircle, HourglassTop, OpenInNew, Refresh } from '@mui/icons-material'
import { useCancelTransaction, usePayTransaction, useTransaction } from '../hooks/use-cinema'
import { ErrorView, LoadingView } from '../components/StateViews'
import { PageReveal } from '../components/Motion'

const statusCopy = {
  pending: { icon: HourglassTop, title: 'Waiting for payment', message: 'Complete payment through Midtrans. This page checks the backend every five seconds.', color: 'text-secondary' },
  paid: { icon: CheckCircle, title: 'Payment confirmed', message: 'Your transaction has been verified by the backend. Your tickets are ready.', color: 'text-green-400' },
  cancelled: { icon: Cancel, title: 'Transaction cancelled', message: 'This transaction was cancelled or expired. Please create a new booking.', color: 'text-primary' },
} as const

export function PaymentStatusPage() {
  const { transactionId } = useParams()
  const query = useTransaction(transactionId)
  const paymentMutation = usePayTransaction()
  const cancelMutation = useCancelTransaction()

  if (query.isLoading) return <LoadingView label="Verifying payment with the backend…" />
  if (query.isError || !query.data) return <ErrorView message={query.error?.message ?? 'Transaction not found'} retry={() => void query.refetch()} />

  const transaction = query.data
  const content = statusCopy[transaction.payment_status]
  const StatusIcon = content.icon
  const continuePayment = () => paymentMutation.mutate(transaction.id, { onSuccess: (session) => window.location.assign(session.redirect_url) })
  const cancel = () => cancelMutation.mutate(transaction.id, { onSuccess: () => void query.refetch() })

  return <PageReveal><Container maxWidth="sm" className="py-20"><section className="rounded-2xl border border-white/10 bg-surface p-7 text-center shadow-2xl sm:p-10"><StatusIcon className={`!text-6xl ${content.color}`} /><p className="eyebrow mt-5">Transaction status</p><h1 className="mt-2 font-display text-3xl font-extrabold">{content.title}</h1><p className="mt-4 leading-7 text-white/55">{content.message}</p><div className="mt-7 rounded-xl bg-black/20 p-5 text-left text-sm"><div className="flex justify-between text-white/50"><span>Transaction</span><span className="max-w-[210px] truncate font-mono text-white/75">{transaction.id}</span></div><div className="mt-3 flex justify-between text-white/50"><span>Total</span><strong className="text-white">Rp{transaction.total_price.toLocaleString('id-ID')}</strong></div><div className="mt-3 flex justify-between text-white/50"><span>Status</span><strong className="capitalize text-white">{transaction.payment_status}</strong></div></div>{paymentMutation.isError && <Alert severity="error" className="!mt-5">{paymentMutation.error.message}</Alert>}{cancelMutation.isError && <Alert severity="error" className="!mt-5">{cancelMutation.error.message}</Alert>}<div className="mt-7 flex flex-col gap-3">{transaction.payment_status === 'pending' && <><Button variant="contained" size="large" startIcon={<OpenInNew />} loading={paymentMutation.isPending} onClick={continuePayment}>Continue payment</Button><Button color="inherit" startIcon={query.isFetching ? <CircularProgress size={16} /> : <Refresh />} onClick={() => void query.refetch()}>Check again</Button><Button color="error" loading={cancelMutation.isPending} onClick={cancel}>Cancel transaction</Button></>}{transaction.payment_status === 'paid' && <Button component={Link} to="/tickets" variant="contained">View tickets</Button>}{transaction.payment_status === 'cancelled' && <Button component={Link} to="/" variant="contained">Book another movie</Button>}</div></section></Container></PageReveal>
}
