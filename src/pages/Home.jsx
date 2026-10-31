import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { gsap, reducedMotion, isSmall, isTouch } from '../lib/motion'
import useScrollFx from '../lib/useScrollFx'
import { useReady } from '../App'
import HeroScene from '../components/HeroScene'
import Lines from '../components/Lines'
import Magnetic from '../components/Magnetic'
import Marquee from '../components/Marquee'
import Video from '../components/Video'
import { PROJECTS, SERVICES, PROCESS, img } from '../data'

export default function Home() {
  const scope = useRef(null)
  useScrollFx(scope)
  return (
    <div ref={scope}>
      <Hero />
      <Marquee items={['Weddings', 'Ad Films', 'Food & Cafe', 'Events', 'Product', 'Digital Marketing', 'Fashion']} />
      <Statement />
      <ServiceList />
      <FeaturedWork />
      <Showreel />
      <Marketing />
      <Process />
      <Cta />
    </div>
  )
}

/* ------------------------------------------------------------------ HERO */
function Hero() {
  const ready = useReady()
  const root = useRef(null)
  const [webgl, setWebgl] = useState(false)

  useEffect(() => { setWebgl(!reducedMotion() && !isSmall()) }, [])

  // intro reveal once the preloader lifts
  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (reducedMotion()) return
      const tl = gsap.timeline({ delay: 0.15 })
      tl.from('.hero-title .line-mask > span', { yPercent: 115, rotate: 3, duration: 1.4, ease: 'expo.out', stagger: 0.1 })
        .from('.hero-eyebrow', { autoAlpha: 0, y: 20, duration: 1, ease: 'power3.out' }, 0.2)
        .from('.hero-foot > *', { autoAlpha: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.7)
        .from('.hero-side', { autoAlpha: 0, duration: 1.2 }, 0.9)
        .from('.hero-fallback .hf-card', { yPercent: 40, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12 }, 0.2)

      // scroll out: headline drifts up and dissolves, the scene keeps spinning behind it
      gsap.to('.hero-content', {
        yPercent: -18,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 30%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" ref={root}>
      {webgl ? <HeroScene ready={ready} /> : <HeroFallback />}
      <div className="hero-shade" />

      <div className="hero-content wrap">
        <p className="hero-eyebrow eyebrow"><span className="dot" />Mainstream Digitals · Creative Agency</p>

        <h1 className="hero-title">
          <span className="line-mask"><span>We don't just</span></span>
          <span className="line-mask"><span><em className="italic">capture</em> moments.</span></span>
          <span className="line-mask"><span>We create <em className="italic blue-glow">impact.</em></span></span>
        </h1>

        <div className="hero-foot">
          <p className="lead">From unforgettable weddings to scroll-stopping brand campaigns, we turn ideas into visuals that move people.</p>
          <div className="hero-ctas">
            <Magnetic><Link to="/work" className="btn btn-blue" data-cursor="Explore">Explore Our Work <span className="arrow">↗</span></Link></Magnetic>
            <Magnetic><Link to="/contact" className="btn btn-ghost">Let's Create <span className="arrow">→</span></Link></Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-side eyebrow">
        <span>Photography</span><i /> <span>Films</span><i /> <span>Marketing</span>
      </div>
      <div className="hero-scroll" aria-hidden>
        <span className="eyebrow">Scroll</span>
        <span className="hero-scroll-line"><span /></span>
      </div>
    </section>
  )
}

// Mobile / reduced-motion stand-in for the WebGL ring: three floating reel cards.
function HeroFallback() {
  const cards = ['bridal-reel', 'prewed-reel', 'saree-reel']
  return (
    <div className="hero-fallback" aria-hidden>
      {cards.map((c, i) => (
        <div className="hf-card" key={c} style={{ '--i': i }}>
          <Video name={c} />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- STATEMENT */
function Statement() {
  const ref = useRef(null)
  const text = 'We are a creative studio for photography, films and campaigns. We tell stories people remember and build brands people choose.'
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.st-word', { opacity: 0.14 }, {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: '.st-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="statement light" ref={ref}>
      <div className="wrap st-grid">
        <p className="eyebrow"><span className="dot" />Who we are</p>
        <p className="st-text serif">
          {text.split(' ').map((w, i) => (
            <span key={i} className={`st-word ${['stories', 'remember', 'brands', 'choose.'].includes(w) ? 'italic blue' : ''}`}>{w} </span>
          ))}
        </p>
        <div className="st-images">
          <div className="media st-img-a" data-img><img src={img('prewed-1', 'sm')} alt="Pre-wedding portrait in tall grass" loading="lazy" /></div>
          <div className="media st-img-b" data-img><img src={img('food-mocktail', 'sm')} alt="Citrus mocktail food shoot" loading="lazy" /></div>
        </div>
        <div className="st-cta" data-fade>
          <Link to="/about" className="btn btn-ghost">Our story <span className="arrow">→</span></Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- SERVICE LIST */
function ServiceList() {
  const [active, setActive] = useState(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 })
  const ref = useRef(null)
  const touch = typeof window !== 'undefined' && isTouch()

  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <section className="services-home" ref={ref} onMouseMove={move} onMouseLeave={() => setActive(null)}>
      <div className="wrap sh-head">
        <Lines className="h-lg" lines={['What we', <>do <span className="italic blue">best.</span></>]} />
        <p className="lead" data-fade>Six disciplines under one roof, so your shoot, your film and your campaign all speak the same visual language.</p>
      </div>

      <ul className="sh-list wrap">
        {SERVICES.map((s, i) => (
          <li key={s.id} onMouseEnter={() => setActive(i)} className={active !== null && active !== i ? 'dim' : ''}>
            <Link to={`/services#${s.id}`} data-cursor="View">
              <span className="sh-n">0{i + 1}</span>
              <span className="sh-title serif">{s.title}</span>
              <span className="sh-line">{s.line}</span>
              <span className="sh-arrow">↗</span>
            </Link>
            {touch && (
              <div className="sh-thumb media"><img src={img(s.image, 'sm')} alt="" loading="lazy" /></div>
            )}
          </li>
        ))}
      </ul>

      {!touch && (
        <motion.div className="sh-float" style={{ x: sx, y: sy }}>
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.img
                key={active}
                src={img(SERVICES[active].image, 'sm')}
                alt=""
                initial={{ opacity: 0, scale: 0.85, rotate: -4, clipPath: 'inset(50% 50% 50% 50%)' }}
                animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}

/* -------------------------------------------------------- FEATURED WORK */
function FeaturedWork() {
  const root = useRef(null)
  const track = useRef(null)
  const featured = PROJECTS.filter((p) => !p.coverIsVideo).slice(0, 6)

  useLayoutEffect(() => {
    if (reducedMotion() || isSmall()) return
    const ctx = gsap.context(() => {
      const dist = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set('.fw-progress span', { scaleX: self.progress }),
        },
      })
      // inner images drift against the track for depth
      gsap.utils.toArray('.fw-card img').forEach((im) => {
        gsap.fromTo(im, { xPercent: -10 }, {
          xPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: im.closest('.fw-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="featured" ref={root}>
      <div className="fw-top wrap">
        <p className="eyebrow"><span className="dot" />Selected work</p>
        <div className="fw-progress"><span /></div>
        <Link to="/work" className="eyebrow fw-all">All projects ↗</Link>
      </div>
      <div className="fw-track" ref={track}>
        <div className="fw-intro">
          <Lines className="h-lg" lines={['Stories', <>we've <span className="italic blue">told.</span></>]} />
          <p className="lead" data-fade>A few frames from weddings, kitchens, stages and studios. Scroll to move through the reel.</p>
        </div>
        {featured.map((p, i) => (
          <Link to={`/work/${p.slug}`} key={p.slug} className={`fw-card ${i % 2 ? 'low' : ''}`} data-cursor="View">
            <div className="media fw-media"><img src={img(p.cover)} alt={p.title} loading="lazy" /></div>
            <div className="fw-meta">
              <span className="eyebrow muted">{String(i + 1).padStart(2, '0')} / {p.category}</span>
              <h3 className="h-md">{p.title}</h3>
              <span className="muted">{p.year}</span>
            </div>
          </Link>
        ))}
        <Link to="/work" className="fw-end" data-cursor="Open">
          <span className="h-lg">View all<br /><span className="italic blue">work</span> ↗</span>
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- SHOWREEL */
function Showreel() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=120%', pin: true, scrub: 1 },
      })
      tl.fromTo('.sr-frame', { clipPath: 'inset(28% 34% 28% 34% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut' })
        .fromTo('.sr-frame video', { scale: 1.35 }, { scale: 1, ease: 'power2.inOut' }, 0)
        .fromTo('.sr-left', { xPercent: 0 }, { xPercent: -60, autoAlpha: 0, ease: 'power2.in' }, 0)
        .fromTo('.sr-right', { xPercent: 0 }, { xPercent: 60, autoAlpha: 0, ease: 'power2.in' }, 0)
        .from('.sr-caption', { autoAlpha: 0, y: 40, ease: 'power2.out' }, 0.6)
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="showreel" ref={root}>
      <div className="sr-frame" data-cursor="Play">
        <Video name="garba-event" />
        <div className="sr-caption wrap">
          <p className="eyebrow"><span className="dot" />Showreel · Garba Nights</p>
          <h3 className="h-lg">Moments in <span className="italic">motion.</span></h3>
        </div>
      </div>
      <div className="sr-words" aria-hidden>
        <span className="sr-left h-xl">Every</span>
        <span className="sr-right h-xl italic blue">frame.</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ MARKETING */
function Marketing() {
  const items = [
    ['Social Media Management', 'Calendars, content and community, handled end to end.'],
    ['Meta & Google Ads', 'Targeted campaigns built around what actually converts.'],
    ['Performance Marketing', 'Testing, tracking and scaling with clear reporting.'],
    ['Brand Strategy', 'Positioning, tone and identity that hold together everywhere.'],
    ['Creative Ad Production', 'Reels, statics and ad films made for each platform.'],
    ['Content Creation', 'A steady stream of on-brand photo and video assets.'],
  ]
  return (
    <section className="marketing white">
      <div className="wrap mk-head">
        <p className="eyebrow"><span className="dot" />Digital marketing & advertising</p>
        <Lines className="h-lg" lines={['Creative that gets attention.', <span className="italic blue" key="b">Strategy that gets results.</span>]} />
      </div>
      <div className="wrap mk-grid" data-stagger>
        {items.map(([t, d], i) => (
          <div className="mk-card" key={t}>
            <span className="mk-n">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="serif">{t}</h4>
            <p>{d}</p>
            <span className="mk-fill" />
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- PROCESS */
function Process() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.pr-line span', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.pr-steps', start: 'top 75%', end: 'bottom 55%', scrub: true } })
      gsap.utils.toArray('.pr-step').forEach((s, i) => {
        gsap.from(s, { autoAlpha: 0, y: 60, duration: 1, ease: 'power3.out', delay: i * 0.08, scrollTrigger: { trigger: '.pr-steps', start: 'top 75%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="process" ref={root}>
      <div className="wrap">
        <div className="pr-head">
          <Lines className="h-lg" lines={['How we', <span className="italic blue" key="w">work.</span>]} />
          <p className="lead" data-fade>A clear four-step process, from the first conversation to the final campaign report.</p>
        </div>
        <div className="pr-line"><span /></div>
        <div className="pr-steps">
          {PROCESS.map((p) => (
            <div className="pr-step" key={p.n}>
              <span className="pr-n serif">{p.n}</span>
              <h4 className="serif">{p.t}</h4>
              <p className="muted">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ CTA */
function Cta() {
  return (
    <section className="cta">
      <div className="cta-bg media"><img src={img('bridal-3')} alt="" data-parallax="10" loading="lazy" /></div>
      <div className="cta-inner wrap">
        <p className="eyebrow"><span className="dot" />Have a story to tell?</p>
        <Lines className="h-xl" lines={["Let's make it", <span className="italic" key="u">unforgettable.</span>]} />
        <Magnetic strength={0.4}>
          <Link to="/contact" className="cta-circle" data-cursor="Let's go">
            <span>Start a<br />Project ↗</span>
          </Link>
        </Magnetic>
      </div>
    </section>
  )
}
