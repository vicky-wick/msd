import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    open: false,
  },

  preview: {
    port: 4173,
  },

  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    // keep media files as real URLs so they cache and lazy-load
    assetsInlineLimit: 2048,
    // three.js alone is ~500 kB minified; it is isolated in its own chunk below
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/three/')) return 'three'
          if (id.includes('gsap') || id.includes('lenis')) return 'gsap'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
          if (id.includes('react')) return 'react'
        },
      },
    },
  },
})
