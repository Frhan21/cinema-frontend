import type { PropsWithChildren, ReactNode } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface FormDialogProps extends PropsWithChildren {
  open: boolean
  title: string
  description?: string
  submitLabel: string
  loading?: boolean
  submitDisabled?: boolean
  onClose: () => void
  onSubmit: () => void
  maxWidth?: 'xs' | 'sm' | 'md'
  alert?: ReactNode
}

export function FormDialog({ open, title, description, submitLabel, loading, submitDisabled, onClose, onSubmit, maxWidth = 'sm', alert, children }: FormDialogProps) {
  return <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth={maxWidth}><DialogTitle className="!font-display !font-bold">{title}{description && <span className="mt-1 block font-sans text-sm font-normal text-white/50">{description}</span>}</DialogTitle><DialogContent dividers>{alert}<div className="grid gap-5 py-2">{children}</div></DialogContent><DialogActions className="!p-4"><Button color="inherit" onClick={onClose} disabled={loading}>Cancel</Button><Button variant="contained" onClick={onSubmit} loading={loading} disabled={submitDisabled}>{submitLabel}</Button></DialogActions></Dialog>
}

export function ConfirmDeleteDialog({ open, subject, loading, error, onClose, onConfirm }: { open: boolean; subject: string; loading?: boolean; error?: string; onClose: () => void; onConfirm: () => void }) {
  return <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs"><DialogTitle className="!font-display !font-bold">Delete {subject}?</DialogTitle><DialogContent>{error && <Alert severity="error" className="!mb-4">{error}</Alert>}<p className="text-sm leading-6 text-white/60">This action cannot be undone. Related schedules or records may prevent deletion.</p></DialogContent><DialogActions className="!p-4"><Button color="inherit" onClick={onClose} disabled={loading}>Keep data</Button><Button color="error" variant="contained" onClick={onConfirm} loading={loading}>Delete</Button></DialogActions></Dialog>
}
