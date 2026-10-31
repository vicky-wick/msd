import { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from './lib/motion'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Footer from './components/Footer'
import Transition from './components/Transition'
import Home from './pages/Home'
import Work from './pages/Work'
import Project from './pages/Project'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'

const ReadyCtx = createContext(false)
export const useReady = () => useContext(ReadyCtx)

let lenis
export const scrollTo = (target, opts) => lenis?.scrollTo(target, opts)

export default function App() {
  const location = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reducedMotion()) return
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy(); lenis = null }
  }, [])

  useEffect(() => {
    if (ready) lenis?.start(); else lenis?.stop()
  }, [ready])

  const onExitComplete = () => {
    lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
  }

  return (
    <ReadyCtx.Provider value={ready}>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div className="grain" aria-hidden />
      <Cursor />
      <Nav />
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/work" element={<Page><Work /></Page>} />
          <Route path="/work/:slug" element={<Page><Project /></Page>} />
          <Route path="/services" element={<Page><Services /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="*" element={<Page><Home /></Page>} />
        </Routes>
      </AnimatePresence>
    </ReadyCtx.Provider>
  )
}

function Page({ children }) {
  return (
    <Transition>
      <main>{children}</main>
      <Footer />
    </Transition>
  )
}
