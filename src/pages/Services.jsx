import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useScrollFx from '../lib/useScrollFx'
import Lines from '../components/Lines'
import Magnetic from '../components/Magnetic'
import Marquee from '../components/Marquee'
import { SERVICES, PROJECTS, img } from '../data'
import { scrollTo } from '../App'

const RELATED = {
  weddings: ['the-red-bride', 'monsoon-promise'],
  commercial: ['silver-heritage', 'glass-and-gold'],
  food: ['the-spice-table'],
  events: ['after-dark', 'garba-nights'],
  ads: ['glass-and-gold', 'crown-season'],
  marketing: ['the-spice-table', 'silver-heritage'],
}

export default function Services() {
  const scope = useRef(null)
  const { hash } = useLocation()
  useScrollFx(scope)

  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => {
      const el = document.querySelector(hash)
      if (!el) return
      scrollTo ? scrollTo(el, { offset: -40 }) : el.scrollIntoView()
    }, 1000)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <div ref={scope} className="services-page">
      <header className="page-hero wrap">
        <p className="eyebrow" data-fade><span className="dot" />Services</p>
        <Lines as="h1" className="h-xl" lines={['One studio.', <>Every <span className="italic blue">frame.</span></>]} />
        <p className="lead" data-fade>Photography, film, design and paid media under one roof, so the story stays consistent from the shoot to the ad that runs it.</p>
      </header>

      <Marquee items={SERVICES.map((s) => s.title)} speed={50} />

      <div className="svc-list">
        {SERVICES.map((s, i) => (
          <section className={`svc ${i % 2 ? 'rev' : ''}`} id={s.id} key={s.id}>
            <div className="svc-media">
              <div className="media" data-img><img src={img(s.image)} alt={s.title} loading="lazy" data-parallax="6" /></div>
              <span className="svc-num serif">0{i + 1}</span>
            </div>
            <div className="svc-body">
              <p className="eyebrow muted">{s.line}</p>
              <Lines className="h-lg" lines={[s.title]} />
              <ul data-stagger>
                {s.points.map((pt) => <li key={pt}><span className="blue">✦</span>{pt}</li>)}
              </ul>
              <div className="svc-related" data-fade>
                <span className="eyebrow muted">See it in</span>
                {RELATED[s.id].map((slug) => {
                  const p = PROJECTS.find((x) => x.slug === slug)
                  return <Link key={slug} to={`/work/${slug}`} className="svc-chip" data-cursor="View">{p.title} ↗</Link>
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="svc-cta wrap">
        <Lines className="h-lg" lines={['Not sure what you need?', <span className="italic blue" key="t">Let's talk it through.</span>]} />
        <Magnetic><Link to="/contact" className="btn btn-blue" data-cursor="Talk">Get a custom quote <span className="arrow">↗</span></Link></Magnetic>
      </section>
    </div>
  )
}
