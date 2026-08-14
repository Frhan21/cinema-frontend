import type { ReactNode } from 'react'
import { Box, Button, CircularProgress, Pagination } from '@mui/material'
import { Refresh } from '@mui/icons-material'

export interface AdminColumn<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  className?: string
}

interface AdminDataTableProps<T> {
  items: T[]
  columns: AdminColumn<T>[]
  getKey: (item: T) => string
  loading?: boolean
  error?: string
  emptyMessage: string
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onRetry?: () => void
}

export function AdminDataTable<T>({ items, columns, getKey, loading, error, emptyMessage, page = 1, totalPages = 1, onPageChange, onRetry }: AdminDataTableProps<T>) {
  if (loading) return <Box className="grid min-h-56 place-items-center"><CircularProgress size={30} /></Box>
  if (error) return <Box className="grid min-h-56 place-items-center px-5 text-center"><div><p className="text-sm text-primary">{error}</p>{onRetry && <Button startIcon={<Refresh />} onClick={onRetry} className="!mt-3">Retry</Button>}</div></Box>
  if (!items.length) return <Box className="grid min-h-56 place-items-center px-5 text-center text-sm text-white/45">{emptyMessage}</Box>

  return <><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 text-[10px] uppercase tracking-[.14em] text-white/40"><tr>{columns.map((column) => <th key={column.key} className={`px-5 py-4 font-bold ${column.className ?? ''}`}>{column.header}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={getKey(item)} className="border-b border-white/5 transition hover:bg-white/[.025]">{columns.map((column) => <td key={column.key} className={`px-5 py-4 ${column.className ?? ''}`}>{column.render(item)}</td>)}</tr>)}</tbody></table></div>{totalPages > 1 && <div className="flex justify-end p-5"><Pagination page={page} count={totalPages} color="primary" onChange={(_, nextPage) => onPageChange?.(nextPage)} /></div>}</>
}
