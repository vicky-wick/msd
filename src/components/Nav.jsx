import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Logo from './Logo'
import Magnetic from './Magnetic'
import { CONTACT } from '../data'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(null)
  const { pathname } = useLocation()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => setOpen(false), [pathname])
  const activeIdx = LINKS.findIndex((l) => (l.to === '/' ? pathname === '/' : pathname.startsWith(l.to)))
  const pillIdx = hover ?? activeIdx

  return (
    <>
      <motion.div className="progress" style={{ scaleX }} />
      <motion.header
        className="nav"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className="nav-logo" aria-label="Mainstream Digitals home">
          <Logo size={40} sColor="#fff" />
        </Link>

        <nav className="nav-pill" onMouseLeave={() => setHover(null)}>
          {LINKS.map((l, i) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onMouseEnter={() => setHover(i)} style={{ zIndex: 1 }}>
              {pillIdx === i && <motion.span layoutId="pill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Magnetic strength={0.25}>
          <Link to="/contact" className="btn btn-blue nav-cta">Book a Shoot <span className="arrow">↗</span></Link>
        </Magnetic>

        <button className={`menu-btn ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <span /><span />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ clipPath: 'circle(150% at 92% 5%)' }}
            exit={{ clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            {LINKS.map((l, i) => (
              <motion.div key={l.to} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <Link to={l.to}>{l.label}<span className="blue">.</span></Link>
              </motion.div>
            ))}
            <div className="meta">
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
