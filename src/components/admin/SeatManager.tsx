import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, FormControlLabel, IconButton, MenuItem, Switch, TextField, Tooltip } from '@mui/material'
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { adminService } from '../../services/admin-service'
import type { ApiSeat, CreateSeatRequest } from '../../types/api'
import { AdminDataTable, type AdminColumn } from './AdminDataTable'
import { ConfirmDeleteDialog, FormDialog } from './AdminDialogs'
import { AdminSection } from './AdminSection'

const emptyForm: Required<CreateSeatRequest> = { studio_id: '', seat_number: '', is_available: true }

export function SeatManager() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ApiSeat | null>(null)
  const [deleting, setDeleting] = useState<ApiSeat | null>(null)
  const [form, setForm] = useState(emptyForm)
  const seatsQuery = useQuery({ queryKey: ['admin', 'seats', page], queryFn: () => adminService.seats.list({ page, per_page: 20 }) })
  const studiosQuery = useQuery({ queryKey: ['admin', 'studios', 'options'], queryFn: () => adminService.studios.list({ page: 1, per_page: 100 }) })
  const studioMap = new Map((studiosQuery.data?.data ?? []).map((studio) => [studio.id, studio.name]))
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'seats'] })
  const createMutation = useMutation({ mutationFn: adminService.seats.create, onSuccess: () => { void refresh(); close() } })
  const updateMutation = useMutation({ mutationFn: ({ seat, payload }: { seat: ApiSeat; payload: typeof form }) => adminService.seats.update(seat.id, { id: seat.id, ...payload }), onSuccess: () => { void refresh(); close() } })
  const deleteMutation = useMutation({ mutationFn: adminService.seats.remove, onSuccess: () => { void refresh(); setDeleting(null) } })
  const valid = Boolean(form.studio_id && /^[A-Z]+\d+$/i.test(form.seat_number.trim()))

  function close() { setOpen(false); setEditing(null); setForm(emptyForm); createMutation.reset(); updateMutation.reset() }
  const edit = (seat: ApiSeat) => { setEditing(seat); setForm({ studio_id: seat.studio_id, seat_number: seat.seat_number, is_available: seat.is_available }); setOpen(true) }
  const submit = () => {
    const payload = { ...form, seat_number: form.seat_number.trim().toUpperCase() }
    if (editing) updateMutation.mutate({ seat: editing, payload })
    else createMutation.mutate(payload)
  }
  const columns: AdminColumn<ApiSeat>[] = [
    { key: 'seat', header: 'Seat', render: (seat) => <strong className="font-display text-lg">{seat.seat_number}</strong> },
    { key: 'studio', header: 'Studio', render: (seat) => studioMap.get(seat.studio_id) ?? <span className="font-mono text-xs text-white/40">{seat.studio_id}</span> },
    { key: 'status', header: 'Master status', render: (seat) => <span className={seat.is_available ? 'text-green-400' : 'text-primary'}>{seat.is_available ? 'Active' : 'Disabled'}</span> },
    { key: 'actions', header: 'Actions', render: (seat) => <div className="flex"><Tooltip title="Edit seat"><IconButton aria-label={`Edit seat ${seat.seat_number}`} onClick={() => edit(seat)}><EditOutlined fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete seat"><IconButton aria-label={`Delete seat ${seat.seat_number}`} color="error" onClick={() => setDeleting(seat)}><DeleteOutline fontSize="small" /></IconButton></Tooltip></div> },
  ]

  return <><AdminSection eyebrow="Auditorium" title="Seats" description="Configure master seats. Per-schedule availability still comes from ticket availability." action={<Button variant="contained" startIcon={<Add />} onClick={() => { setForm(emptyForm); setOpen(true) }} disabled={!studiosQuery.data?.data.length}>New seat</Button>}><AdminDataTable items={seatsQuery.data?.data ?? []} columns={columns} getKey={(seat) => seat.id} loading={seatsQuery.isLoading || studiosQuery.isLoading} error={seatsQuery.error?.message ?? studiosQuery.error?.message} emptyMessage={studiosQuery.data?.data.length ? 'No seats configured yet.' : 'Create a studio before adding seats.'} page={page} totalPages={seatsQuery.data?.meta.total_page ?? 1} onPageChange={setPage} onRetry={() => { void seatsQuery.refetch(); void studiosQuery.refetch() }} /></AdminSection><FormDialog open={open} title={editing ? `Edit seat ${editing.seat_number}` : 'Create seat'} description="Seat numbers use row and number format, for example A1 or AA12." submitLabel={editing ? 'Save changes' : 'Create seat'} loading={createMutation.isPending || updateMutation.isPending} submitDisabled={!valid} onClose={close} onSubmit={submit} alert={(createMutation.error ?? updateMutation.error) ? <Alert severity="error" className="!mb-4">{(createMutation.error ?? updateMutation.error)?.message}</Alert> : undefined}><TextField select label="Studio" value={form.studio_id} onChange={(event) => setForm({ ...form, studio_id: event.target.value })} required>{(studiosQuery.data?.data ?? []).map((studio) => <MenuItem key={studio.id} value={studio.id}>{studio.name}</MenuItem>)}</TextField><TextField label="Seat number" value={form.seat_number} onChange={(event) => setForm({ ...form, seat_number: event.target.value.toUpperCase() })} placeholder="A1" error={Boolean(form.seat_number && !/^[A-Z]+\d+$/i.test(form.seat_number))} helperText="Letters followed by a number" required /><FormControlLabel control={<Switch checked={form.is_available} onChange={(event) => setForm({ ...form, is_available: event.target.checked })} />} label="Seat is active in the studio master" /></FormDialog><ConfirmDeleteDialog open={Boolean(deleting)} subject={`seat ${deleting?.seat_number ?? ''}`} loading={deleteMutation.isPending} error={deleteMutation.error?.message} onClose={() => { deleteMutation.reset(); setDeleting(null) }} onConfirm={() => deleting && deleteMutation.mutate(deleting.id)} /></>
}
