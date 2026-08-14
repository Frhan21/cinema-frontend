import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, IconButton, TextField, Tooltip } from '@mui/material'
import { Add, DeleteOutline, Download, EditOutlined } from '@mui/icons-material'
import { adminService } from '../../services/admin-service'
import type { ApiMovie, CreateMovieRequest } from '../../types/api'
import { AdminDataTable, type AdminColumn } from './AdminDataTable'
import { ConfirmDeleteDialog, FormDialog } from './AdminDialogs'
import { AdminSection } from './AdminSection'

const emptyForm: CreateMovieRequest = { title: '', genre: '', description: '', duration: 120, poster_url: '' }

export function MovieManager({ importOpen, onImportOpen, onImportClose }: { importOpen: boolean; onImportOpen: () => void; onImportClose: () => void }) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ApiMovie | null>(null)
  const [deleting, setDeleting] = useState<ApiMovie | null>(null)
  const [form, setForm] = useState<CreateMovieRequest>(emptyForm)
  const [tmdbId, setTmdbId] = useState('')
  const query = useQuery({ queryKey: ['admin', 'movies', page], queryFn: () => adminService.movies.list({ page, per_page: 10 }) })
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] })
  const createMutation = useMutation({ mutationFn: adminService.movies.create, onSuccess: () => { void refresh(); closeForm() } })
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: CreateMovieRequest }) => adminService.movies.update(id, payload), onSuccess: () => { void refresh(); closeForm() } })
  const importMutation = useMutation({ mutationFn: adminService.movies.importTmdb, onSuccess: () => { void refresh(); setTmdbId(''); onImportClose() } })
  const deleteMutation = useMutation({ mutationFn: adminService.movies.remove, onSuccess: () => { void refresh(); setDeleting(null) } })
  const mutationError = createMutation.error ?? updateMutation.error
  const valid = form.title.trim() && form.genre.trim() && form.description.trim() && Number.isInteger(Number(form.duration)) && Number(form.duration) > 0 && /^https?:\/\//.test(form.poster_url)

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
    setForm(emptyForm)
    createMutation.reset()
    updateMutation.reset()
  }

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormOpen(true) }
  const openEdit = (movie: ApiMovie) => { setEditing(movie); setForm({ tmdb_id: movie.tmdb_id, title: movie.title, genre: movie.genre, description: movie.description, duration: movie.duration, poster_url: movie.poster_url }); setFormOpen(true) }
  const submit = () => editing ? updateMutation.mutate({ id: editing.id, payload: form }) : createMutation.mutate(form)
  const columns: AdminColumn<ApiMovie>[] = [
    { key: 'movie', header: 'Movie', render: (movie) => <div className="flex items-center gap-3"><img src={movie.poster_url} alt="" className="h-14 w-10 rounded object-cover" /><div><strong className="block max-w-64 truncate">{movie.title}</strong><span className="text-xs text-white/40">{movie.genre} · {movie.duration} min</span></div></div> },
    { key: 'tmdb', header: 'TMDB ID', render: (movie) => <span className="font-mono text-xs text-white/55">{movie.tmdb_id ?? 'Manual'}</span> },
    { key: 'id', header: 'Internal ID', render: (movie) => <span className="block max-w-40 truncate font-mono text-xs text-white/40" title={movie.id}>{movie.id}</span> },
    { key: 'actions', header: 'Actions', render: (movie) => <div className="flex"><Tooltip title="Edit movie"><IconButton aria-label={`Edit ${movie.title}`} onClick={() => openEdit(movie)}><EditOutlined fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete movie"><IconButton aria-label={`Delete ${movie.title}`} color="error" onClick={() => setDeleting(movie)}><DeleteOutline fontSize="small" /></IconButton></Tooltip></div> },
  ]

  return <><AdminSection eyebrow="Catalog" title="Movies & releases" description="Import directly from TMDB or maintain a manual internal movie record." action={<div className="flex flex-wrap gap-2"><Button variant="outlined" startIcon={<Add />} onClick={openCreate}>Manual movie</Button><Button variant="contained" startIcon={<Download />} onClick={() => { setTmdbId(''); onImportOpen() }}>Import TMDB</Button></div>}><AdminDataTable items={query.data?.data ?? []} columns={columns} getKey={(movie) => movie.id} loading={query.isLoading} error={query.error?.message} emptyMessage="No internal movies yet. Import a TMDB movie to create your first release." page={page} totalPages={query.data?.meta.total_page ?? 1} onPageChange={setPage} onRetry={() => void query.refetch()} /></AdminSection>

  <FormDialog open={importOpen} title="Import new release from TMDB" description="The backend fetches and stores the movie using its numeric TMDB ID." submitLabel="Import release" loading={importMutation.isPending} submitDisabled={!Number.isInteger(Number(tmdbId)) || Number(tmdbId) <= 0} onClose={() => { importMutation.reset(); onImportClose() }} onSubmit={() => importMutation.mutate(Number(tmdbId))} alert={importMutation.isError ? <Alert severity="error" className="!mb-4">{importMutation.error.message}</Alert> : undefined}><TextField label="TMDB movie ID" type="number" value={tmdbId} onChange={(event) => setTmdbId(event.target.value)} helperText="Example: 550. Find this number in the TMDB movie URL." inputProps={{ min: 1, step: 1 }} autoFocus required /></FormDialog>

  <FormDialog open={formOpen} title={editing ? 'Edit movie' : 'Create manual movie'} description={editing ? 'Backend currently may not persist description updates.' : 'Use TMDB import when possible to reduce manual entry.'} submitLabel={editing ? 'Save changes' : 'Create movie'} loading={createMutation.isPending || updateMutation.isPending} submitDisabled={!valid} onClose={closeForm} onSubmit={submit} alert={mutationError ? <Alert severity="error" className="!mb-4">{mutationError.message}</Alert> : editing ? <Alert severity="warning" className="!mb-4">Description update is not reliable in the current backend handler.</Alert> : undefined}><div className="grid gap-5 sm:grid-cols-2"><TextField label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /><TextField label="Genre" value={form.genre} onChange={(event) => setForm({ ...form, genre: event.target.value })} required /><TextField label="Duration (minutes)" type="number" value={form.duration} onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })} inputProps={{ min: 1, step: 1 }} required /><TextField label="TMDB ID (optional)" type="number" value={form.tmdb_id ?? ''} onChange={(event) => setForm({ ...form, tmdb_id: event.target.value ? Number(event.target.value) : undefined })} inputProps={{ min: 1, step: 1 }} /></div><TextField label="Poster URL" type="url" value={form.poster_url} onChange={(event) => setForm({ ...form, poster_url: event.target.value })} helperText="Must start with http:// or https://" required /><TextField label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} multiline minRows={4} required /></FormDialog>

  <ConfirmDeleteDialog open={Boolean(deleting)} subject={deleting?.title ?? 'movie'} loading={deleteMutation.isPending} error={deleteMutation.error?.message} onClose={() => { deleteMutation.reset(); setDeleting(null) }} onConfirm={() => deleting && deleteMutation.mutate(deleting.id)} />
  </>
}
