import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import Logo from './Logo'

export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [n, setN] = useState(0)

  useLayoutEffect(() => {
    if (reducedMotion()) { onDone(); return }
    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.set('.pl-logo', { autoAlpha: 1 })
        .from('.logo-m', { xPercent: -60, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
        .from('.logo-d', { xPercent: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
        .from('.logo-s', { yPercent: -70, rotate: -12, autoAlpha: 0, duration: 1.2, ease: 'expo.out', transformOrigin: '50% 50%' }, 0.35)
        .from('.logo-word', { autoAlpha: 0, y: 10, duration: 0.8, ease: 'power3.out' }, 0.8)
        .to(counter, { v: 100, duration: 2.1, ease: 'power2.inOut', onUpdate: () => setN(Math.round(counter.v)) }, 0)
        .to('.pl-logo', { scale: 0.85, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '+=0.15')
        .to('.pl-meta', { autoAlpha: 0, duration: 0.4 }, '<')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.2')
        .add(() => onDone(), '-=0.75')
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={root} className="preloader" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <div className="pl-logo" style={{ visibility: 'hidden' }}>
        <Logo size={150} showWord sColor="#fff" />
      </div>
      <div className="pl-meta tag eyebrow muted"><span className="dot" />Photography · Films · Marketing</div>
      <div className="pl-meta count">{String(n).padStart(3, '0')}</div>
    </div>
  )
}
