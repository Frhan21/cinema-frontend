import type { ComponentProps, PropsWithChildren } from 'react'
import { motion } from 'motion/react'

export function PageReveal({ children }: PropsWithChildren) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
}

export function Reveal({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  return <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
}

export function MotionArticle(props: ComponentProps<typeof motion.article>) {
  return <motion.article {...props} />
}
