import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, reducedMotion } from '../lib/motion'
import useScrollFx from '../lib/useScrollFx'
import Lines from '../components/Lines'
import Magnetic from '../components/Magnetic'
import Video from '../components/Video'
import { img } from '../data'

const VALUES = [
  ['Story first', 'Every shoot starts with what the moment, or the brand, should make people feel.'],
  ['One team', 'Photographers, filmmakers, designers and marketers who plan together from day one.'],
  ['Craft in the details', 'Light, styling, colour and edit get the same care as the big idea.'],
  ['Built to perform', 'Beautiful work that is also cut, sized and targeted to actually reach people.'],
]

export default function About() {
  const scope = useRef(null)
  useScrollFx(scope)

  // collage spreads apart as you scroll through it
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.ab-collage', start: 'top 80%', end: 'bottom 20%', scrub: 1 } })
      tl.fromTo('.ab-c1', { y: 120, rotate: -6 }, { y: -60, rotate: -2 }, 0)
        .fromTo('.ab-c2', { y: 40 }, { y: -120 }, 0)
        .fromTo('.ab-c3', { y: 180, rotate: 6 }, { y: -20, rotate: 2 }, 0)
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope} className="about-page">
      <header className="page-hero wrap">
        <p className="eyebrow" data-fade><span className="dot" />About MSD</p>
        <Lines as="h1" className="h-xl" lines={['We see stories', <span className="italic blue" key="d">differently.</span>]} />
      </header>

      <section className="ab-intro wrap">
        <p className="ab-big serif" data-fade>
          Mainstream Digitals is a creative agency where photography, film and digital marketing work as one. We capture weddings and events with a filmmaker's eye, shoot products and food that make people stop scrolling, and run the campaigns that put it all in front of the right audience.
        </p>
        <div className="ab-side" data-fade>
          <p className="muted">From a bride's first look to a brand's first ad, we care about the same thing: work that feels honest, looks unforgettable and moves people to act.</p>
          <Magnetic><Link to="/work" className="btn btn-ghost">See our work <span className="arrow">↗</span></Link></Magnetic>
        </div>
      </section>

      <section className="ab-collage wrap">
        <div className="ab-c1 media"><img src={img('event-singer-1', 'sm')} alt="Live singer under blue stage lights" loading="lazy" /></div>
        <div className="ab-c2 media"><Video name="bridal-reel" /></div>
        <div className="ab-c3 media"><img src={img('silver-swans', 'sm')} alt="Silver swan product shoot" loading="lazy" /></div>
      </section>

      <section className="ab-values light">
        <div className="wrap">
          <Lines className="h-lg" lines={['What we', <span className="italic blue" key="b">believe.</span>]} />
          <div className="ab-grid" data-stagger>
            {VALUES.map(([t, d], i) => (
              <div className="ab-val" key={t}>
                <span className="serif ab-n">0{i + 1}</span>
                <h4 className="serif">{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-quote wrap">
        <div className="media ab-quote-img" data-img><img src={img('prewed-3')} alt="" loading="lazy" /></div>
        <blockquote className="h-md serif" data-fade>
          “We don't just capture moments. <span className="italic blue">We create impact.</span>”
          <cite className="eyebrow muted">The MSD promise</cite>
        </blockquote>
      </section>
    </div>
  )
}
