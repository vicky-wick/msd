import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CONTACT } from '../data'
import Magnetic from './Magnetic'

export default function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['18%', '0%'])

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-grid">
        <div>
          <p className="eyebrow muted" style={{ marginBottom: 20 }}><span className="dot" />Mainstream Digitals</p>
          <p className="h-md" style={{ maxWidth: '16ch', marginBottom: 28 }}>Photography, films &amp; campaigns that <span className="italic blue">move people.</span></p>
          <Magnetic><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost">WhatsApp us <span className="arrow">↗</span></a></Magnetic>
        </div>
        <div>
          <h4>Pages</h4>
          <Link to="/work">Work</Link><Link to="/services">Services</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Services</h4>
          <Link to="/services#weddings">Weddings</Link><Link to="/services#commercial">Commercial</Link><Link to="/services#ads">Ad Films</Link><Link to="/services#marketing">Marketing</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${CONTACT.email}`} style={{ wordBreak: 'break-all' }}>{CONTACT.email}</a>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>
        </div>
      </div>
      <motion.div className="footer-big" style={{ x }}>
        Mainstream<span className="blue italic"> Digitals</span>
      </motion.div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Mainstream Digitals (MSD). All rights reserved.</span>
        <span>Photography · Films · Advertising · Digital Marketing</span>
      </div>
    </footer>
  )
}
