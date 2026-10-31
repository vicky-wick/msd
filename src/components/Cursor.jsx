import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { isTouch } from '../lib/motion'

// Elements opt in with data-cursor="View" / "Play" / "Drag".
export default function Cursor() {
  const [label, setLabel] = useState('')
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 300, damping: 30, mass: 0.6 })

  useEffect(() => {
    if (isTouch()) return
    setEnabled(true)
    document.body.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX); y.set(e.clientY)
      const t = e.target.closest?.('[data-cursor]')
      setLabel(t ? t.getAttribute('data-cursor') : '')
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); document.body.classList.remove('has-cursor') }
  }, [x, y])

  if (!enabled) return null
  return (
    <div className="cursor" aria-hidden>
      <motion.div className="cursor-dot" style={{ x, y }} animate={{ scale: label ? 0 : 1 }} />
      <AnimatePresence>
        {label && (
          <motion.div
            className="cursor-ring"
            style={{ x: rx, y: ry, width: 96, height: 96, marginLeft: -48, marginTop: -48 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
