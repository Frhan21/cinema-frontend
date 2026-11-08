import type { ComponentProps, PropsWithChildren } from 'react'
import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

export function PageReveal({ children }: PropsWithChildren) {
  return <motion.div initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.48, ease }}>{children}</motion.div>
}

export function Reveal({ children, delay = 0, className }: PropsWithChildren<{ delay?: number; className?: string }>) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28, clipPath: 'inset(0 0 18% 0)' }} whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.58, delay, ease }}>{children}</motion.div>
}

export function MotionArticle(props: ComponentProps<typeof motion.article>) {
  return <motion.article {...props} />
}
