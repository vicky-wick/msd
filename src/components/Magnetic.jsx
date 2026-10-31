import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Subtle magnetic pull toward the pointer. Framer owns the transform here, so never animate this node with GSAP.
export default function Magnetic({ children, strength = 0.3, className = '', ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ x: sx, y: sy, display: 'inline-block' }} className={className} {...rest}>
      {children}
    </motion.div>
  )
}
