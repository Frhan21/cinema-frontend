import { Alert, Box, Button, CircularProgress, Skeleton } from '@mui/material'

export function LoadingView({ label = 'Loading cinematic experience…' }: { label?: string }) {
  return <Box className="grid min-h-[45vh] place-items-center" role="status" aria-live="polite"><div className="text-center"><CircularProgress size={32} /><p className="mt-4 text-sm text-white/60">{label}</p></div></Box>
}

export function ErrorView({ message, retry }: { message: string; retry?: () => void }) {
  return <Box className="mx-auto grid min-h-[45vh] max-w-xl place-items-center px-4"><Alert severity="error" action={retry ? <Button color="inherit" onClick={retry}>Retry</Button> : undefined}>{message}</Alert></Box>
}

export function MovieGridSkeleton() {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-label="Memuat film" aria-busy="true">{Array.from({ length: 8 }, (_, index) => <div key={index}><Skeleton variant="rounded" animation="wave" className="!aspect-[2/3] !h-auto !bg-white/[.06]" /><Skeleton width="75%" className="!mt-2 !bg-white/[.06]" /></div>)}</div>
}
