import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Chip, IconButton, TextField, Tooltip } from '@mui/material'
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { adminService } from '../../services/admin-service'
import type { CreatePromoRequest, Promo } from '../../types/api'
import { AdminDataTable, type AdminColumn } from './AdminDataTable'
import { ConfirmDeleteDialog, FormDialog } from './AdminDialogs'
import { AdminSection } from './AdminSection'

interface PromoForm { code: string; description: string; discount: number; max_usage: number; start_date: string; end_date: string }
const emptyForm: PromoForm = { code: '', description: '', discount: 10, max_usage: 0, start_date: '', end_date: '' }
const toInputDate = (value: string) => value.slice(0, 16)
const toRfc3339 = (value: string) => `${value}:00+07:00`

export function PromoManager() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Promo | null>(null)
  const [deleting, setDeleting] = useState<Promo | null>(null)
  const [form, setForm] = useState<PromoForm>(emptyForm)
  const query = useQuery({ queryKey: ['admin', 'promos'], queryFn: adminService.promos.list })
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'promos'] })
  const createMutation = useMutation({ mutationFn: adminService.promos.create, onSuccess: () => { void refresh(); close() } })
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: CreatePromoRequest }) => adminService.promos.update(id, payload), onSuccess: () => { void refresh(); close() } })
  const deleteMutation = useMutation({ mutationFn: adminService.promos.remove, onSuccess: () => { void refresh(); setDeleting(null) } })
  const start = form.start_date ? new Date(toRfc3339(form.start_date)) : null
  const end = form.end_date ? new Date(toRfc3339(form.end_date)) : null
  const valid = Boolean(/^[A-Z0-9_-]+$/.test(form.code) && form.description.trim() && Number.isInteger(form.discount) && form.discount >= 1 && form.discount <= 100 && Number.isInteger(form.max_usage) && form.max_usage >= 0 && start && end && end > start)

  function close() { setOpen(false); setEditing(null); setForm(emptyForm); createMutation.reset(); updateMutation.reset() }
  const edit = (promo: Promo) => { setEditing(promo); setForm({ code: promo.code, description: promo.description, discount: promo.discount, max_usage: promo.max_usage, start_date: toInputDate(promo.start_date), end_date: toInputDate(promo.end_date) }); setOpen(true) }
  const submit = () => {
    const payload: CreatePromoRequest = { ...form, code: form.code.trim().toUpperCase(), start_date: toRfc3339(form.start_date), end_date: toRfc3339(form.end_date) }
    if (editing) updateMutation.mutate({ id: editing.id, payload })
    else createMutation.mutate(payload)
  }
  const columns: AdminColumn<Promo>[] = [
    { key: 'code', header: 'Code', render: (promo) => <div><strong className="font-mono text-base text-secondary">{promo.code}</strong><span className="block max-w-64 truncate text-xs text-white/40">{promo.description}</span></div> },
    { key: 'discount', header: 'Discount', render: (promo) => <strong>{promo.discount}%</strong> },
    { key: 'usage', header: 'Usage', render: (promo) => `${promo.used_count} / ${promo.max_usage === 0 ? '∞' : promo.max_usage}` },
    { key: 'period', header: 'Period', render: (promo) => <span className="text-xs text-white/55">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(promo.start_date))}<br />to {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(promo.end_date))}</span> },
    { key: 'status', header: 'Status', render: (promo) => <Chip label={promo.is_active ? 'Active' : 'Inactive'} color={promo.is_active ? 'success' : 'default'} size="small" /> },
    { key: 'actions', header: 'Actions', render: (promo) => <div className="flex"><Tooltip title="Edit promo"><IconButton aria-label={`Edit promo ${promo.code}`} onClick={() => edit(promo)}><EditOutlined fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete promo"><IconButton aria-label={`Delete promo ${promo.code}`} color="error" onClick={() => setDeleting(promo)}><DeleteOutline fontSize="small" /></IconButton></Tooltip></div> },
  ]

  return <><AdminSection eyebrow="Campaigns" title="Promotions" description="Create percentage discounts with usage and date limits." action={<Button variant="contained" startIcon={<Add />} onClick={() => { setForm(emptyForm); setOpen(true) }}>New promo</Button>}><AdminDataTable items={query.data ?? []} columns={columns} getKey={(promo) => promo.id} loading={query.isLoading} error={query.error?.message} emptyMessage="No promotions yet." onRetry={() => void query.refetch()} /></AdminSection><FormDialog open={open} title={editing ? `Edit ${editing.code}` : 'Create promotion'} description="max_usage 0 means unlimited. Dates are sent as RFC3339 Asia/Jakarta." submitLabel={editing ? 'Save changes' : 'Create promo'} loading={createMutation.isPending || updateMutation.isPending} submitDisabled={!valid} onClose={close} onSubmit={submit} alert={(createMutation.error ?? updateMutation.error) ? <Alert severity="error" className="!mb-4">{(createMutation.error ?? updateMutation.error)?.message}</Alert> : undefined}><div className="grid gap-5 sm:grid-cols-2"><TextField label="Promo code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} error={Boolean(form.code && !/^[A-Z0-9_-]+$/.test(form.code))} helperText="Letters, numbers, underscore, or hyphen" required /><TextField label="Discount (%)" type="number" value={form.discount} onChange={(event) => setForm({ ...form, discount: Number(event.target.value) })} inputProps={{ min: 1, max: 100, step: 1 }} required /><TextField label="Maximum usage" type="number" value={form.max_usage} onChange={(event) => setForm({ ...form, max_usage: Number(event.target.value) })} helperText="Use 0 for unlimited" inputProps={{ min: 0, step: 1 }} required /><TextField label="Start date" type="datetime-local" value={form.start_date} onChange={(event) => setForm({ ...form, start_date: event.target.value })} InputLabelProps={{ shrink: true }} required /><TextField label="End date" type="datetime-local" value={form.end_date} onChange={(event) => setForm({ ...form, end_date: event.target.value })} InputLabelProps={{ shrink: true }} error={Boolean(start && end && end <= start)} helperText={start && end && end <= start ? 'End date must be after start date' : 'Asia/Jakarta'} required /></div><TextField label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} multiline minRows={3} required /></FormDialog><ConfirmDeleteDialog open={Boolean(deleting)} subject={`promo ${deleting?.code ?? ''}`} loading={deleteMutation.isPending} error={deleteMutation.error?.message} onClose={() => { deleteMutation.reset(); setDeleting(null) }} onConfirm={() => deleting && deleteMutation.mutate(deleting.id)} /></>
}
