import { motion } from 'framer-motion'

const ease = [0.76, 0, 0.24, 1]

// Two stacked panels (royal blue, then black) sweep over the page on route change.
export default function Transition({ children }) {
  return (
    <>
      {children}
      <motion.div className="curtain" initial={{ y: '0%' }} animate={{ y: '-100%' }} exit={{ y: '0%' }} transition={{ duration: 0.8, ease, delay: 0.05 }} style={{ transformOrigin: 'top' }} />
      <motion.div className="curtain curtain-2" initial={{ y: '0%' }} animate={{ y: '-100%' }} exit={{ y: '0%', transition: { duration: 0.8, ease, delay: 0.08 } }} transition={{ duration: 0.8, ease, delay: 0.18 }} />
    </>
  )
}
