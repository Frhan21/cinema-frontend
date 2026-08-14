import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, IconButton, MenuItem, TextField, Tooltip } from '@mui/material'
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { adminService } from '../../services/admin-service'
import type { CreateScheduleRequest, Schedule } from '../../types/api'
import { formatJakartaDateTime } from '../../utils/date'
import { AdminDataTable, type AdminColumn } from './AdminDataTable'
import { ConfirmDeleteDialog, FormDialog } from './AdminDialogs'
import { AdminSection } from './AdminSection'

interface ScheduleForm { movie_id: string; studio_id: string; start_time: string; price: number }
const emptyForm: ScheduleForm = { movie_id: '', studio_id: '', start_time: '', price: 50000 }
const toInputDate = (value: string) => value.replace(' ', 'T').slice(0, 16)
const toApiDate = (value: string) => value.replace('T', ' ')

export function ScheduleManager() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Schedule | null>(null)
  const [deleting, setDeleting] = useState<Schedule | null>(null)
  const [form, setForm] = useState<ScheduleForm>(emptyForm)
  const [validationNow, setValidationNow] = useState(0)
  const schedulesQuery = useQuery({ queryKey: ['admin', 'schedules', page], queryFn: () => adminService.schedules.list({ page, per_page: 10 }) })
  const moviesQuery = useQuery({ queryKey: ['admin', 'movies', 'options'], queryFn: () => adminService.movies.list({ page: 1, per_page: 100 }) })
  const studiosQuery = useQuery({ queryKey: ['admin', 'studios', 'options'], queryFn: () => adminService.studios.list({ page: 1, per_page: 100 }) })
  const movies = moviesQuery.data?.data ?? []
  const studios = studiosQuery.data?.data ?? []
  const movieMap = new Map(movies.map((movie) => [movie.id, movie.title]))
  const studioMap = new Map(studios.map((studio) => [studio.id, studio.name]))
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'schedules'] })
  const createMutation = useMutation({ mutationFn: adminService.schedules.create, onSuccess: () => { void refresh(); close() } })
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: CreateScheduleRequest }) => adminService.schedules.update(id, payload), onSuccess: () => { void refresh(); close() } })
  const deleteMutation = useMutation({ mutationFn: adminService.schedules.remove, onSuccess: () => { void refresh(); setDeleting(null) } })
  const startDate = form.start_time ? new Date(`${form.start_time}:00+07:00`) : null
  const valid = Boolean(form.movie_id && form.studio_id && startDate && startDate.getTime() > validationNow && Number.isInteger(form.price) && form.price > 0)

  function close() { setOpen(false); setEditing(null); setForm(emptyForm); createMutation.reset(); updateMutation.reset() }
  const edit = (schedule: Schedule) => { setValidationNow(Date.now()); setEditing(schedule); setForm({ movie_id: schedule.movie_id, studio_id: schedule.studio_id, start_time: toInputDate(schedule.start_time), price: schedule.price }); setOpen(true) }
  const submit = () => {
    const payload: CreateScheduleRequest = { ...form, start_time: toApiDate(form.start_time) }
    if (editing) updateMutation.mutate({ id: editing.id, payload })
    else createMutation.mutate(payload)
  }
  const columns: AdminColumn<Schedule>[] = [
    { key: 'movie', header: 'Movie', render: (schedule) => <div><strong>{movieMap.get(schedule.movie_id) ?? `TMDB ${schedule.tmdb_id}`}</strong><span className="block text-xs text-white/40">{studioMap.get(schedule.studio_id) ?? schedule.studio?.name}</span></div> },
    { key: 'start', header: 'Starts', render: (schedule) => <span className="text-sm">{formatJakartaDateTime(schedule.start_time)}</span> },
    { key: 'end', header: 'Ends', render: (schedule) => <span className="text-sm text-white/55">{formatJakartaDateTime(schedule.end_time)}</span> },
    { key: 'price', header: 'Price', render: (schedule) => <strong>Rp{schedule.price.toLocaleString('id-ID')}</strong> },
    { key: 'actions', header: 'Actions', render: (schedule) => <div className="flex"><Tooltip title="Edit schedule"><IconButton aria-label="Edit schedule" onClick={() => edit(schedule)}><EditOutlined fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete schedule"><IconButton aria-label="Delete schedule" color="error" onClick={() => setDeleting(schedule)}><DeleteOutline fontSize="small" /></IconButton></Tooltip></div> },
  ]
  const optionsReady = movies.length > 0 && studios.length > 0

  return <><AdminSection eyebrow="Programming" title="Schedules" description="Publish future showtimes. End time and overlap validation are handled by the backend." action={<Button variant="contained" startIcon={<Add />} onClick={() => { setValidationNow(Date.now()); setForm(emptyForm); setOpen(true) }} disabled={!optionsReady}>New schedule</Button>}><AdminDataTable items={schedulesQuery.data?.data ?? []} columns={columns} getKey={(schedule) => schedule.id} loading={schedulesQuery.isLoading || moviesQuery.isLoading || studiosQuery.isLoading} error={schedulesQuery.error?.message ?? moviesQuery.error?.message ?? studiosQuery.error?.message} emptyMessage={optionsReady ? 'No schedules published yet.' : 'Import a movie and create a studio before publishing schedules.'} page={page} totalPages={schedulesQuery.data?.meta.total_page ?? 1} onPageChange={setPage} onRetry={() => { void schedulesQuery.refetch(); void moviesQuery.refetch(); void studiosQuery.refetch() }} /></AdminSection><FormDialog open={open} title={editing ? 'Edit schedule' : 'Publish schedule'} description="Time is entered and displayed in Asia/Jakarta." submitLabel={editing ? 'Save changes' : 'Publish schedule'} loading={createMutation.isPending || updateMutation.isPending} submitDisabled={!valid} onClose={close} onSubmit={submit} alert={(createMutation.error ?? updateMutation.error) ? <Alert severity="error" className="!mb-4">{(createMutation.error ?? updateMutation.error)?.message}</Alert> : undefined}><div className="grid gap-5 sm:grid-cols-2"><TextField select label="Movie" value={form.movie_id} onChange={(event) => setForm({ ...form, movie_id: event.target.value })} required>{movies.map((movie) => <MenuItem key={movie.id} value={movie.id}>{movie.title}</MenuItem>)}</TextField><TextField select label="Studio" value={form.studio_id} onChange={(event) => setForm({ ...form, studio_id: event.target.value })} required>{studios.map((studio) => <MenuItem key={studio.id} value={studio.id}>{studio.name}</MenuItem>)}</TextField><TextField label="Start time" type="datetime-local" value={form.start_time} onChange={(event) => setForm({ ...form, start_time: event.target.value })} InputLabelProps={{ shrink: true }} error={Boolean(startDate && startDate.getTime() <= validationNow)} helperText={startDate && startDate.getTime() <= validationNow ? 'Start time must be in the future' : 'Asia/Jakarta'} required /><TextField label="Price (IDR)" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} inputProps={{ min: 1, step: 1000 }} required /></div></FormDialog><ConfirmDeleteDialog open={Boolean(deleting)} subject="schedule" loading={deleteMutation.isPending} error={deleteMutation.error?.message} onClose={() => { deleteMutation.reset(); setDeleting(null) }} onConfirm={() => deleting && deleteMutation.mutate(deleting.id)} /></>
}
