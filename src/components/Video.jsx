import { useEffect, useRef } from 'react'
import { vid } from '../data'

// Muted looping clip that only plays while on screen.
export default function Video({ name, className = '', ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.15 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  const { src, poster } = vid(name)
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" {...rest} />
}
