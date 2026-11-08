import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Button, Container, CircularProgress } from '@mui/material'
import { Receipt, ReceiptLong } from '@mui/icons-material'
import { PageReveal } from '../components/Motion'

// Return handler Midtrans Snap. Query parameter redirect tidak dianggap bukti
// pembayaran; keputusan status tetap di halaman status yang membaca backend.
export function PaymentFinishPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Midtrans membuat order_id lokal dengan format "cinema-<transaction-uuid>".
  const transactionId = /^cinema-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.exec(searchParams.get('order_id')?.trim() ?? '')?.[1] ?? null

  useEffect(() => {
    if (transactionId) navigate(`/payment/status/${transactionId}`, { replace: true })
  }, [navigate, transactionId])

  if (transactionId) {
    return <PageReveal><Container maxWidth="sm" className="py-24"><div className="flex flex-col items-center gap-4 text-center"><CircularProgress /><p className="text-sm text-white/55">Returning from Midtrans. Checking your payment status…</p></div></Container></PageReveal>
  }

  return <PageReveal><Container maxWidth="sm" className="py-24"><Alert severity="error" icon={<ReceiptLong />}>We could not read the payment reference returned by Midtrans. Open your transactions to check the latest payment status — nothing was charged based on this redirect.</Alert><div className="mt-6 flex flex-wrap justify-center gap-3"><Button component={Link} to="/tickets" variant="contained" startIcon={<Receipt />}>View transactions</Button><Button component={Link} to="/" variant="outlined" color="inherit">Back to home</Button></div></Container></PageReveal>
}
