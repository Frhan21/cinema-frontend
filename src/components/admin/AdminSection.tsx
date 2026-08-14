import type { PropsWithChildren, ReactNode } from 'react'

export function AdminSection({ eyebrow, title, description, action, children }: PropsWithChildren<{ eyebrow: string; title: string; description: string; action?: ReactNode }>) {
  return <section className="overflow-hidden rounded-xl border border-white/10 bg-surface"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 p-5"><div><p className="eyebrow text-primary">{eyebrow}</p><h2 className="mt-1 font-display text-2xl font-bold">{title}</h2><p className="mt-1 text-sm text-white/45">{description}</p></div>{action}</div>{children}</section>
}
