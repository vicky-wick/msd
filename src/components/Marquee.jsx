import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion'

// Infinite marquee whose speed and direction follow scroll velocity.
export default function Marquee({ items, speed = 40 }) {
  const track = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const el = track.current
    const tween = gsap.to(el, { xPercent: -50, duration: speed, ease: 'none', repeat: -1 })
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity() / 400
        gsap.to(tween, { timeScale: (self.direction || 1) * Math.max(1, Math.abs(v)), duration: 0.3, overwrite: true })
        gsap.to(tween, { timeScale: self.direction || 1, duration: 1.2, delay: 0.3 })
      },
    })
    return () => { tween.kill(); st.kill() }
  }, [speed])
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track" ref={track}>
        {[0, 1].map((k) => (
          <span key={k}>
            {row.map((t, i) => (
              <span key={i}>{t}<i>✦</i></span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
