import { Button, Chip } from '@mui/material'
import { CalendarMonth, ConfirmationNumber, QrCode2 } from '@mui/icons-material'
import type { Ticket } from '../types/domain'

const dateTime = (value: string) => new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <article className="grid overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl md:grid-cols-[150px_1fr_auto]">
      <img src={ticket.movie.posterUrl} alt="" className="h-44 w-full object-cover md:h-full" />
      <div className="p-5">
        <Chip label={ticket.showtime.format} size="small" color="primary" className="!mb-3 !h-5 !text-[9px]" />
        <h2 className="font-display text-xl font-bold">{ticket.movie.title}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-white/60"><CalendarMonth fontSize="small" /> {dateTime(ticket.showtime.startsAt)}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-white/60"><ConfirmationNumber fontSize="small" /> {ticket.showtime.theater} · {ticket.showtime.studio}</p>
        <div className="mt-5 flex gap-10"><div><span className="eyebrow">Row</span><strong className="block">{ticket.seats[0]?.[0]}</strong></div><div><span className="eyebrow">Seats</span><strong className="block">{ticket.seats.join(', ')}</strong></div></div>
      </div>
      <div className="flex min-w-48 flex-col items-center justify-center gap-3 border-t border-dashed border-white/15 bg-white/[.025] p-5 md:border-l md:border-t-0">
        <QrCode2 sx={{ fontSize: 64 }} aria-hidden="true" />
        <span className="font-mono text-xs text-white/50">{ticket.bookingCode}</span>
        <Button variant="contained" size="small">View QR Pass</Button>
      </div>
    </article>
  )
}
