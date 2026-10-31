import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useScrollFx from '../lib/useScrollFx'
import Lines from '../components/Lines'
import Magnetic from '../components/Magnetic'
import { CONTACT, img } from '../data'

const NEEDS = ['Wedding', 'Pre-wedding', 'Event', 'Food & Cafe', 'Product', 'Ad Film', 'Social Media', 'Paid Ads']

export default function Contact() {
  const scope = useRef(null)
  const [needs, setNeeds] = useState([])
  const [sent, setSent] = useState(false)
  useScrollFx(scope)

  const toggle = (n) => setNeeds((a) => (a.includes(n) ? a.filter((x) => x !== n) : [...a, n]))

  // No backend yet: compose the enquiry in the visitor's mail app.
  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = [
      `Name: ${f.get('name')}`,
      `Email: ${f.get('email')}`,
      `Phone: ${f.get('phone') || '-'}`,
      `Looking for: ${needs.join(', ') || '-'}`,
      `Date / timeline: ${f.get('date') || '-'}`,
      '',
      f.get('message'),
    ].join('\n')
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`New enquiry from ${f.get('name')}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div ref={scope} className="contact-page">
      <header className="page-hero wrap">
        <p className="eyebrow" data-fade><span className="dot" />Contact</p>
        <Lines as="h1" className="h-xl" lines={["Let's create", <span className="italic blue" key="s">something.</span>]} />
      </header>

      <section className="ct-grid wrap">
        <div className="ct-direct" data-stagger>
          <a href={`mailto:${CONTACT.email}`} className="ct-link" data-cursor="Email">
            <span className="eyebrow muted">Email</span>
            <span className="ct-big serif">{CONTACT.email}</span>
          </a>
          <a href={CONTACT.phoneHref} className="ct-link" data-cursor="Call">
            <span className="eyebrow muted">Phone</span>
            <span className="ct-big serif">{CONTACT.phone}</span>
          </a>
          <Magnetic><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-blue">Chat on WhatsApp <span className="arrow">↗</span></a></Magnetic>
          <div className="media ct-img" data-img><img src={img('model-1', 'sm')} alt="" loading="lazy" /></div>
        </div>

        <form className="ct-form" onSubmit={submit} data-fade>
          <h3 className="h-md">Tell us about your <span className="italic blue">project.</span></h3>
          <div className="ct-row">
            <Field name="name" label="Your name" required />
            <Field name="email" type="email" label="Email" required />
          </div>
          <div className="ct-row">
            <Field name="phone" type="tel" label="Phone (optional)" />
            <Field name="date" label="Date or timeline" />
          </div>
          <fieldset>
            <legend className="eyebrow muted">I'm looking for</legend>
            <div className="chips">
              {NEEDS.map((n) => (
                <button type="button" key={n} className={`chip ${needs.includes(n) ? 'on solid' : ''}`} onClick={() => toggle(n)}>
                  <span>{n}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <Field name="message" label="A few words about the story you want to tell" textarea required />
          <div className="ct-submit">
            <Magnetic><button className="btn btn-blue" type="submit">Send enquiry <span className="arrow">↗</span></button></Magnetic>
            <AnimatePresence>
              {sent && (
                <motion.p className="muted" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  Your mail app should open with the details filled in.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </section>
    </div>
  )
}

function Field({ name, label, type = 'text', textarea, required }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className="field">
      <Tag name={name} type={textarea ? undefined : type} required={required} placeholder=" " rows={textarea ? 4 : undefined} />
      <span>{label}</span>
      <i />
    </label>
  )
}
