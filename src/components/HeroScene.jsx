import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '../lib/motion'
import { img, vid } from '../data'

const CARDS = [
  { t: 'video', src: 'bridal-reel' },
  { t: 'img', src: 'food-biryani' },
  { t: 'img', src: 'event-singer-1' },
  { t: 'img', src: 'silver-peacocks' },
  { t: 'video', src: 'prewed-reel' },
  { t: 'img', src: 'model-2' },
  { t: 'img', src: 'food-burger' },
  { t: 'img', src: 'event-dj-1' },
  { t: 'video', src: 'saree-reel' },
  { t: 'img', src: 'prewed-2' },
  { t: 'img', src: 'silver-swans' },
  { t: 'img', src: 'pageant-2' },
]

const vert = /* glsl */ `
  uniform float uBend;
  uniform float uWave;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // bow the card so the ring reads as one continuous curved surface
    p.z -= (p.x * p.x) * uBend;
    // scroll-velocity ripple
    p.z += sin(p.y * 2.2 + uTime * 2.0) * uWave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const frag = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uCover;   // uv scale for object-fit: cover
  uniform float uAlpha;
  uniform float uFacing; // 1 when card faces camera
  varying vec2 vUv;
  void main() {
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    vec3 c = texture2D(uTex, uv).rgb;
    // cards turning away sink into a deep royal-blue tint
    vec3 tint = mix(c * vec3(0.25, 0.38, 0.75), c, smoothstep(0.0, 1.0, uFacing));
    // soft inner vignette
    float v = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x) * smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
    tint *= mix(0.55, 1.0, v);
    gl_FragColor = vec4(tint, uAlpha);
  }
`

export default function HeroScene({ ready }) {
  const mount = useRef(null)
  const api = useRef(null)

  useEffect(() => {
    const el = mount.current
    const W = () => el.clientWidth
    const H = () => el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(W(), H())
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, W() / H(), 0.1, 100)
    camera.position.set(0, 0.6, 19)

    const ring = new THREE.Group()
    const tilt = new THREE.Group()
    tilt.rotation.set(0.12, 0, -0.1)
    tilt.add(ring)
    scene.add(tilt)

    const R = 8
    const CW = 2.7
    const CH = 3.9
    const geo = new THREE.PlaneGeometry(CW, CH, 32, 8)
    const loader = new THREE.TextureLoader()
    const videos = []
    const mats = []

    CARDS.forEach((c, i) => {
      const uniforms = {
        uTex: { value: null },
        uCover: { value: new THREE.Vector2(1, 1) },
        uAlpha: { value: 0 },
        uFacing: { value: 1 },
        uBend: { value: 0.035 },
        uWave: { value: 0 },
        uTime: { value: 0 },
      }
      const setCover = (iw, ih) => {
        const planeR = CW / CH
        const imgR = iw / ih
        uniforms.uCover.value.set(imgR > planeR ? planeR / imgR : 1, imgR > planeR ? 1 : imgR / planeR)
      }

      if (c.t === 'video') {
        const v = document.createElement('video')
        Object.assign(v, { src: vid(c.src).src, muted: true, loop: true, playsInline: true, crossOrigin: 'anonymous', preload: 'auto' })
        v.setAttribute('muted', '')
        v.play().catch(() => {})
        videos.push(v)
        const tex = new THREE.VideoTexture(v)
        tex.colorSpace = THREE.SRGBColorSpace
        uniforms.uTex.value = tex
        v.addEventListener('loadedmetadata', () => setCover(v.videoWidth, v.videoHeight))
        // poster as a first frame while the clip buffers
        loader.load(vid(c.src).poster, (p) => {
          if (v.readyState < 2) { p.colorSpace = THREE.SRGBColorSpace; uniforms.uTex.value = p; setCover(p.image.width, p.image.height) }
          v.addEventListener('playing', () => { uniforms.uTex.value = tex }, { once: true })
        })
      } else {
        loader.load(img(c.src, 'sm'), (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = 4
          uniforms.uTex.value = tex
          setCover(tex.image.width, tex.image.height)
        })
      }

      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag, transparent: true, side: THREE.DoubleSide, depthWrite: false })
      mats.push(mat)
      const mesh = new THREE.Mesh(geo, mat)
      const a = (i / CARDS.length) * Math.PI * 2
      mesh.position.set(Math.sin(a) * R, 0, Math.cos(a) * R)
      mesh.rotation.y = a
      mesh.userData.angle = a
      ring.add(mesh)
    })

    // ---- interaction state ----
    const state = { mx: 0, my: 0, tx: 0, ty: 0, spin: 0, scroll: 0, vel: 0, intro: 0, zoom: 0 }
    const onMove = (e) => {
      state.tx = (e.clientX / window.innerWidth) * 2 - 1
      state.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const st = ScrollTrigger.create({
      trigger: el.parentElement,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        state.scroll = self.progress
        state.vel = gsap.utils.clamp(-1, 1, self.getVelocity() / 3000)
      },
    })

    const onResize = () => {
      camera.aspect = W() / H()
      // pull back on narrow screens so the ring still fits
      camera.position.z = camera.aspect < 1 ? 27 : 17.5
      camera.updateProjectionMatrix()
      renderer.setSize(W(), H())
    }
    onResize()
    window.addEventListener('resize', onResize)

    let raf
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)
    const clock = new THREE.Clock()
    const tmp = new THREE.Vector3()
    const camDir = new THREE.Vector3()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      state.mx += (state.tx - state.mx) * 0.05
      state.my += (state.ty - state.my) * 0.05
      state.vel *= 0.92
      state.spin += dt * (0.07 + Math.abs(state.vel) * 0.9) + state.mx * dt * 0.25

      ring.rotation.y = state.spin + state.scroll * Math.PI * 0.8
      tilt.rotation.x = 0.12 + state.my * 0.08 + state.scroll * 0.25
      tilt.rotation.z = -0.1 + state.mx * 0.05
      tilt.position.y = 1.1 - state.scroll * 1.5
      camera.position.x = state.mx * 0.8
      camera.lookAt(0, 0, 0)

      const introScale = 0.6 + state.intro * 0.4
      ring.scale.setScalar(introScale)
      camDir.copy(camera.position).normalize()

      ring.children.forEach((m, i) => {
        const u = m.material.uniforms
        u.uTime.value = t
        u.uWave.value = state.vel * 0.35
        m.getWorldDirection(tmp)
        u.uFacing.value = Math.max(0, tmp.dot(camDir))
        const appear = gsap.utils.clamp(0, 1, state.intro * 1.6 - i * 0.05)
        u.uAlpha.value = appear * (1 - state.scroll * 0.9)
        m.position.y = (1 - appear) * -3 + Math.sin(t * 0.6 + i) * 0.08
      })

      renderer.render(scene, camera)
    }
    tick()

    api.current = {
      intro: () => gsap.to(state, { intro: 1, duration: 2.6, ease: 'expo.out' }),
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      st.kill()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      videos.forEach((v) => { v.pause(); v.removeAttribute('src'); v.load() })
      mats.forEach((m) => { m.uniforms.uTex.value?.dispose?.(); m.dispose() })
      geo.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (ready) api.current?.intro()
  }, [ready])

  return <div ref={mount} className="hero-canvas" aria-hidden />
}
