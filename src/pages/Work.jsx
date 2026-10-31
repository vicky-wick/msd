import { useMemo, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import useScrollFx from '../lib/useScrollFx'
import Lines from '../components/Lines'
import Video from '../components/Video'
import { PROJECTS, CATEGORIES, img, ratio } from '../data'

// Flatten every project's gallery into individual frames for the masonry wall.
const FRAMES = PROJECTS.flatMap((p) =>
  [...new Set([p.cover, ...p.gallery])]
    .filter((g) => !(p.coverIsVideo && g === p.cover))
    .map((g) => ({ id: `${p.slug}-${g}`, name: g, project: p })),
).filter((f, i, arr) => arr.findIndex((x) => x.name === f.name) === i)

export default function Work() {
  const scope = useRef(null)
  const [cat, setCat] = useState('All')
  const [view, setView] = useState('projects')
  const [lightbox, setLightbox] = useState(null)
  useScrollFx(scope)

  const projects = useMemo(() => PROJECTS.filter((p) => cat === 'All' || p.category === cat), [cat])
  const frames = useMemo(() => FRAMES.filter((f) => cat === 'All' || f.project.category === cat), [cat])

  return (
    <div ref={scope} className="work-page">
      <header className="page-hero wrap">
        <p className="eyebrow" data-fade><span className="dot" />Portfolio · {PROJECTS.length} projects</p>
        <Lines as="h1" className="h-xl" lines={['Our', <><span className="italic blue">work</span> speaks.</>]} />
        <p className="lead" data-fade>Weddings, kitchens, stages and studios. Filter by what you need, or switch to the full frame wall.</p>
      </header>

      <div className="work-bar wrap">
        <LayoutGroup id="cats">
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
                {cat === c && <motion.span layoutId="chip" className="chip-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="view-toggle">
          {['projects', 'frames'].map((v) => (
            <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'projects' ? (
        <motion.div layout className="proj-grid wrap">
          <AnimatePresence mode="popLayout">
            {projects.map((p, i) => (
              <motion.div
                layout
                key={p.slug}
                className={`proj-card s${i % 5}`}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.05 }}
              >
                <Link to={`/work/${p.slug}`} data-cursor={p.video ? 'Play' : 'View'}>
                  <div className="media proj-media">
                    {p.coverIsVideo ? <Video name={p.cover} /> : <img src={img(p.cover)} alt={p.title} loading="lazy" />}
                    {p.video && !p.coverIsVideo && <HoverVideo name={p.video} />}
                  </div>
                  <div className="proj-meta">
                    <h3 className="serif">{p.title}</h3>
                    <span className="eyebrow muted">{p.category} · {p.year}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="masonry wrap">
          {frames.map((f, i) => (
            <motion.button
              key={f.id}
              className="m-item media"
              style={{ aspectRatio: ratio(f.name) }}
              onClick={() => setLightbox(i)}
              data-cursor="Open"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 }}
            >
              <img src={img(f.name, 'sm')} alt={f.project.title} loading="lazy" />
              <span className="m-tag eyebrow">{f.project.title}</span>
            </motion.button>
          ))}
        </div>
      )}

      <Lightbox frames={frames} index={lightbox} setIndex={setLightbox} />
    </div>
  )
}

function HoverVideo({ name }) {
  const [on, setOn] = useState(false)
  return (
    <div className="hover-video" onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}>
      <AnimatePresence>
        {on && (
          <motion.div className="hv-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Video name={name} autoPlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Lightbox({ frames, index, setIndex }) {
  const open = index !== null && frames[index]
  useEffect(() => {
    if (index === null) return
    const k = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % frames.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + frames.length) % frames.length)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [index, frames.length, setIndex])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIndex(null)} data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.img
              key={frames[index].id}
              src={img(frames[index].name)}
              alt={frames[index].project.title}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>
          <div className="lb-bar" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIndex((i) => (i - 1 + frames.length) % frames.length)}>← Prev</button>
            <span className="eyebrow">{frames[index].project.title} · {index + 1}/{frames.length}</span>
            <button onClick={() => setIndex((i) => (i + 1) % frames.length)}>Next →</button>
          </div>
          <button className="lb-close" onClick={() => setIndex(null)} aria-label="Close">✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
