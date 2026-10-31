import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import useScrollFx from '../lib/useScrollFx'
import Lines from '../components/Lines'
import Video from '../components/Video'
import Magnetic from '../components/Magnetic'
import { PROJECTS, img, ratio } from '../data'

export default function Project() {
  const { slug } = useParams()
  const scope = useRef(null)
  const idx = Math.max(0, PROJECTS.findIndex((p) => p.slug === slug))
  const p = PROJECTS[idx]
  const next = PROJECTS[(idx + 1) % PROJECTS.length]
  useScrollFx(scope, [slug])

  const gallery = p.gallery.filter((g) => g !== p.cover)

  return (
    <div ref={scope} className="project-page">
      <header className="pj-hero">
        <div className="pj-cover media">
          {p.coverIsVideo ? <Video name={p.cover} autoPlay data-parallax="8" /> : <img src={img(p.cover)} alt={p.title} data-parallax="8" />}
        </div>
        <div className="pj-hero-text wrap">
          <p className="eyebrow" data-fade><span className="dot" />{p.category} · {p.year}</p>
          <Lines as="h1" className="h-xl" lines={[p.title]} />
        </div>
      </header>

      <section className="pj-intro wrap">
        <div className="pj-info" data-stagger>
          <div><span className="eyebrow muted">Category</span><p>{p.category}</p></div>
          <div><span className="eyebrow muted">Year</span><p>{p.year}</p></div>
          <div><span className="eyebrow muted">Deliverables</span>{p.services.map((s) => <p key={s}>{s}</p>)}</div>
        </div>
        <p className="pj-story serif" data-fade>{p.intro}</p>
      </section>

      {p.video && !p.coverIsVideo && (
        <section className="pj-film wrap">
          <div className="pj-film-card media" data-img><Video name={p.video} /></div>
          <div className="pj-film-text" data-fade>
            <p className="eyebrow"><span className="dot" />The film</p>
            <h3 className="h-md">Shot for the feed, graded for the <span className="italic blue">memories.</span></h3>
          </div>
        </section>
      )}

      <section className="pj-gallery wrap">
        {gallery.map((g, i) => (
          <div key={g} className={`pj-shot ${ratio(g) > 1.1 ? 'wide' : ''} ${i % 3 === 1 ? 'offset' : ''}`}>
            <div className="media" data-img style={{ aspectRatio: ratio(g) }}>
              <img src={img(g)} alt={`${p.title} frame ${i + 1}`} loading="lazy" />
            </div>
          </div>
        ))}
      </section>

      <Link to={`/work/${next.slug}`} className="pj-next" data-cursor="Next">
        <div className="pj-next-bg media">
          {next.coverIsVideo ? <Video name={next.cover} /> : <img src={img(next.cover)} alt="" loading="lazy" data-parallax="10" />}
        </div>
        <div className="wrap pj-next-inner">
          <span className="eyebrow"><span className="dot" />Next project</span>
          <span className="h-xl">{next.title}</span>
        </div>
      </Link>

      <div className="wrap pj-back">
        <Magnetic><Link to="/work" className="btn btn-ghost">← All projects</Link></Magnetic>
      </div>
    </div>
  )
}
