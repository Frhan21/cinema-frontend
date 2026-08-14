import { Box, Tooltip } from '@mui/material'
import type { Seat } from '../types/domain'

export function SeatMap({ seats, selectedIds, onToggle }: { seats: Seat[]; selectedIds: Set<string>; onToggle: (seat: Seat) => void }) {
  const rows = [...new Set(seats.map((seat) => seat.row))]
  return (
    <Box>
      <div className="mx-auto mb-14 max-w-xl text-center">
        <div className="screen-arc" aria-hidden="true" />
        <span className="eyebrow text-secondary">Screen</span>
      </div>
      <div className="mx-auto w-fit space-y-3 overflow-x-auto px-2 pb-3" role="group" aria-label="Cinema seat map">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-5 text-center text-xs font-bold text-white/45">{row}</span>
            <div className="flex gap-2">
              {seats.filter((seat) => seat.row === row).map((seat, index) => {
                const selected = selectedIds.has(seat.id)
                const occupied = seat.status === 'occupied'
                return (
                  <Tooltip key={seat.id} title={occupied ? `${seat.id} unavailable` : `${seat.id} · Rp${seat.price.toLocaleString('id-ID')}`}>
                    <button
                      type="button"
                      disabled={occupied}
                      aria-pressed={selected}
                      aria-label={`Seat ${seat.id}, ${occupied ? 'occupied' : selected ? 'selected' : seat.status}`}
                      onClick={() => onToggle(seat)}
                      className={`seat ${selected ? 'seat-selected' : occupied ? 'seat-occupied' : seat.status === 'premium' ? 'seat-premium' : ''} ${index === 1 || index === 7 ? 'mr-3' : ''}`}
                    >
                      <span>{seat.number}</span>
                    </button>
                  </Tooltip>
                )
              })}
            </div>
            <span className="w-5 text-center text-xs font-bold text-white/45">{row}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-white/60">
        {[["Available", "seat"], ["Selected", "seat seat-selected"], ["Occupied", "seat seat-occupied"], ["Premium", "seat seat-premium"]].map(([label, className]) => <span key={label} className="flex items-center gap-2"><i className={`${className} !h-4 !w-4`} />{label}</span>)}
      </div>
    </Box>
  )
}
