import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Chip, Container, TextField } from '@mui/material'
import { ArrowBack, LocalOffer, Lock, OpenInNew, Payments } from '@mui/icons-material'
import { selectBookingTotal, useBookingStore } from '../stores/booking-store'
import { useCreateBooking, usePayTransaction, useValidatePromo } from '../hooks/use-cinema'
import { formatJakartaDateTime } from '../utils/date'
import { PageReveal } from '../components/Motion'

export function PaymentPage() {
  const movie = useBookingStore((state) => state.movie)
  const showtime = useBookingStore((state) => state.showtime)
  const seats = useBookingStore((state) => state.selectedSeats)
  const promoCode = useBookingStore((state) => state.promoCode)
  const setPromoCode = useBookingStore((state) => state.setPromoCode)
  const setTransactionId = useBookingStore((state) => state.setTransactionId)
  const transactionId = useBookingStore((state) => state.transactionId)
  const resetBooking = useBookingStore((state) => state.reset)
  const subtotal = useBookingStore(selectBookingTotal)
  const [promoInput, setPromoInput] = useState(promoCode)
  const bookingMutation = useCreateBooking()
  const paymentMutation = usePayTransaction()
  const promoMutation = useValidatePromo()
  const finalPreview = promoMutation.data?.discounted_price ?? subtotal
  const isSubmitting = bookingMutation.isPending || paymentMutation.isPending

  if (!movie || !showtime || !seats.length) {
    return <Container maxWidth="sm" className="py-24"><Alert severity="info">Your booking session is empty. Select a movie and seats first.</Alert><Button component={Link} to="/" variant="contained" className="!mt-5">Browse movies</Button></Container>
  }

  if (transactionId) {
    return <Container maxWidth="sm" className="py-24"><Alert severity="info">A transaction already exists for this booking. Open its status instead of creating a duplicate booking.</Alert><div className="mt-5 flex flex-wrap gap-3"><Button component={Link} to={`/payment/status/${transactionId}`} variant="contained">Open transaction</Button><Button component={Link} to="/" color="inherit" onClick={resetBooking}>Start a new booking</Button></div></Container>
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    promoMutation.mutate({ code, totalPrice: subtotal }, { onSuccess: () => setPromoCode(code) })
  }

  const checkout = () => {
    bookingMutation.mutate({
      schedule_id: showtime.id,
      seat_id: seats.map((seat) => seat.id),
      ...(promoCode ? { promo_code: promoCode } : {}),
    }, {
      onSuccess: (booking) => {
        setTransactionId(booking.transaction_id)
        paymentMutation.mutate(booking.transaction_id, {
          onSuccess: (payment) => window.location.assign(payment.redirect_url),
        })
      },
    })
  }

  return <PageReveal><Container maxWidth="lg" className="py-12 md:py-16">
    <Button component={Link} to={`/booking/${movie.id}/${showtime.id}`} color="inherit" startIcon={<ArrowBack />}>Back to seats</Button>
    <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_380px]">
      <section><p className="eyebrow text-primary">Secure checkout</p><h1 className="font-display text-4xl font-extrabold">Review your booking</h1><p className="mt-3 max-w-2xl leading-7 text-white/55">CineReserve creates the booking first, then redirects you to Midtrans. Payment methods and sensitive payment details are handled securely on the Midtrans page.</p>
        <div className="mt-8 rounded-xl border border-white/10 bg-surface p-6"><div className="flex items-center gap-3"><LocalOffer className="text-primary" /><div><h2 className="font-display font-bold">Promo code</h2><p className="text-sm text-white/45">The final discount is calculated by the backend.</p></div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><TextField label="Promo code" value={promoInput} onChange={(event) => setPromoInput(event.target.value.toUpperCase())} disabled={isSubmitting} fullWidth /><Button variant="outlined" onClick={applyPromo} loading={promoMutation.isPending} disabled={!promoInput.trim()}>Apply</Button></div>{promoMutation.isSuccess && <Alert severity="success" className="!mt-4">Promo {promoMutation.data.code} applied: {promoMutation.data.discount}% discount.</Alert>}{promoMutation.isError && <Alert severity="error" className="!mt-4">{promoMutation.error.message}</Alert>}</div>
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-secondary/20 bg-secondary/5 p-5 text-sm text-white/65"><Lock className="text-secondary" /><p>Prices, discounts, ticket items, and gross amount are calculated by the backend. The frontend never submits a final price.</p></div>
        {(bookingMutation.isError || paymentMutation.isError) && <Alert severity="error" className="!mt-5">{bookingMutation.error?.message ?? paymentMutation.error?.message}{transactionId && <Button component={Link} to={`/payment/status/${transactionId}`} color="inherit" className="!ml-2">Open transaction</Button>}</Alert>}
      </section>
      <aside className="h-fit rounded-xl border border-white/10 bg-surface p-6 lg:sticky lg:top-24"><div className="flex gap-4"><img src={movie.posterUrl} alt="" className="h-28 w-20 rounded-lg object-cover" /><div><p className="eyebrow">Order summary</p><h2 className="mt-2 font-display text-lg font-bold">{movie.title}</h2><p className="mt-2 text-sm leading-6 text-white/50">{showtime.studio}<br />{formatJakartaDateTime(showtime.startsAt)}</p></div></div><div className="mt-6 flex flex-wrap gap-2">{seats.map((seat) => <Chip key={seat.id} label={`${seat.row}${seat.number}`} size="small" />)}</div><div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm"><div className="flex justify-between text-white/60"><span>Subtotal</span><span>Rp{subtotal.toLocaleString('id-ID')}</span></div>{promoMutation.data && <div className="flex justify-between text-secondary"><span>Promo {promoMutation.data.discount}%</span><span>− Rp{(subtotal - finalPreview).toLocaleString('id-ID')}</span></div>}<div className="flex justify-between border-t border-white/10 pt-4 text-lg text-white"><strong>Estimated total</strong><strong>Rp{finalPreview.toLocaleString('id-ID')}</strong></div></div><Button fullWidth variant="contained" size="large" startIcon={<Payments />} endIcon={<OpenInNew />} className="!mt-6" loading={isSubmitting} onClick={checkout}>Continue to Midtrans</Button><p className="mt-3 text-center text-xs leading-5 text-white/35">You will leave CineReserve temporarily. Payment status is always verified again from the backend.</p></aside>
    </div>
  </Container></PageReveal>
}
