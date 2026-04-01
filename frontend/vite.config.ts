import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

function getProxyTarget(): string {
  if (process.env.VITE_PROXY_TARGET) return process.env.VITE_PROXY_TARGET
  try {
    const port = fs
      .readFileSync(path.join(projectRoot, '.api-port'), 'utf8')
      .trim()
    if (port) return `http://localhost:${port}`
  } catch {
    /* fichier absent au premier lancement */
  }
  return 'http://localhost:4000'
}

const proxyTarget = getProxyTarget()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['framer-motion'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: proxyTarget, changeOrigin: true },
      '/uploads': { target: proxyTarget, changeOrigin: true },
    },
  },
})
