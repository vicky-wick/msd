import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from './motion'

/*
  One GSAP context per page, driven by data attributes so markup stays declarative:
    data-lines      -> children .line-mask > span slide up line by line
    data-img        -> clip-path wipe reveal (+ inner image settles from 1.25 scale)
    data-parallax=n -> vertical drift, n = strength (default 12 percent)
    data-fade       -> fade + lift
    data-stagger    -> direct children fade up in sequence
*/
export default function useScrollFx(scope, deps = []) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const reduce = reducedMotion()
    const ctx = gsap.context(() => {
      if (reduce) return

      gsap.utils.toArray('[data-lines]').forEach((el) => {
        gsap.from(el.querySelectorAll('.line-mask > span'), {
          yPercent: 110,
          rotate: 2,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      gsap.utils.toArray('[data-img]').forEach((el) => {
        const inner = el.querySelector('img, video')
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } })
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' })
        if (inner) tl.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.1)
      })

      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 12
        gsap.fromTo(el, { yPercent: -amt }, {
          yPercent: amt,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      gsap.utils.toArray('[data-fade]').forEach((el) => {
        gsap.from(el, { autoAlpha: 0, y: 40, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })

      gsap.utils.toArray('[data-stagger]').forEach((el) => {
        gsap.from(el.children, { autoAlpha: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 85%' } })
      })
    }, scope)

    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => { clearTimeout(t); ctx.revert() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
