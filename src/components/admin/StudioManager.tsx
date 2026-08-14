import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, IconButton, TextField, Tooltip } from '@mui/material'
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { adminService } from '../../services/admin-service'
import type { CreateStudioRequest, Studio } from '../../types/api'
import { AdminDataTable, type AdminColumn } from './AdminDataTable'
import { ConfirmDeleteDialog, FormDialog } from './AdminDialogs'
import { AdminSection } from './AdminSection'

const emptyForm: CreateStudioRequest = { name: '', capacity: 1, facilities: '' }

export function StudioManager() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Studio | null>(null)
  const [deleting, setDeleting] = useState<Studio | null>(null)
  const [form, setForm] = useState<CreateStudioRequest>(emptyForm)
  const query = useQuery({ queryKey: ['admin', 'studios', page], queryFn: () => adminService.studios.list({ page, per_page: 10 }) })
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'studios'] })
  const createMutation = useMutation({ mutationFn: adminService.studios.create, onSuccess: () => { void refresh(); close() } })
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: CreateStudioRequest }) => adminService.studios.update(id, payload), onSuccess: () => { void refresh(); close() } })
  const deleteMutation = useMutation({ mutationFn: adminService.studios.remove, onSuccess: () => { void refresh(); setDeleting(null) } })
  const valid = form.name.trim().length > 0 && Number.isInteger(Number(form.capacity)) && form.capacity > 0 && form.facilities.trim().length > 0

  function close() { setOpen(false); setEditing(null); setForm(emptyForm); createMutation.reset(); updateMutation.reset() }
  const edit = (studio: Studio) => { setEditing(studio); setForm({ name: studio.name, capacity: studio.capacity, facilities: studio.facilities }); setOpen(true) }
  const submit = () => editing ? updateMutation.mutate({ id: editing.id, payload: form }) : createMutation.mutate(form)
  const columns: AdminColumn<Studio>[] = [
    { key: 'name', header: 'Studio', render: (studio) => <div><strong>{studio.name}</strong><span className="block max-w-72 truncate text-xs text-white/40">{studio.facilities}</span></div> },
    { key: 'capacity', header: 'Capacity', render: (studio) => `${studio.capacity} seats` },
    { key: 'id', header: 'ID', render: (studio) => <span className="block max-w-48 truncate font-mono text-xs text-white/40" title={studio.id}>{studio.id}</span> },
    { key: 'actions', header: 'Actions', render: (studio) => <div className="flex"><Tooltip title="Edit studio"><IconButton aria-label={`Edit ${studio.name}`} onClick={() => edit(studio)}><EditOutlined fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete studio"><IconButton aria-label={`Delete ${studio.name}`} color="error" onClick={() => setDeleting(studio)}><DeleteOutline fontSize="small" /></IconButton></Tooltip></div> },
  ]

  return <><AdminSection eyebrow="Venues" title="Studios" description="Manage auditorium capacity and facilities." action={<Button variant="contained" startIcon={<Add />} onClick={() => { setForm(emptyForm); setOpen(true) }}>New studio</Button>}><AdminDataTable items={query.data?.data ?? []} columns={columns} getKey={(studio) => studio.id} loading={query.isLoading} error={query.error?.message} emptyMessage="No studios yet. Create a studio before configuring seats and schedules." page={page} totalPages={query.data?.meta.total_page ?? 1} onPageChange={setPage} onRetry={() => void query.refetch()} /></AdminSection><FormDialog open={open} title={editing ? 'Edit studio' : 'Create studio'} description="Capacity must be a positive integer." submitLabel={editing ? 'Save changes' : 'Create studio'} loading={createMutation.isPending || updateMutation.isPending} submitDisabled={!valid} onClose={close} onSubmit={submit} alert={(createMutation.error ?? updateMutation.error) ? <Alert severity="error" className="!mb-4">{(createMutation.error ?? updateMutation.error)?.message}</Alert> : undefined}><TextField label="Studio name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><TextField label="Capacity" type="number" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })} inputProps={{ min: 1, step: 1 }} required /><TextField label="Facilities" value={form.facilities} onChange={(event) => setForm({ ...form, facilities: event.target.value })} placeholder="Dolby Atmos, Recliner" multiline minRows={3} required /></FormDialog><ConfirmDeleteDialog open={Boolean(deleting)} subject={deleting?.name ?? 'studio'} loading={deleteMutation.isPending} error={deleteMutation.error?.message} onClose={() => { deleteMutation.reset(); setDeleting(null) }} onConfirm={() => deleting && deleteMutation.mutate(deleting.id)} /></>
}
