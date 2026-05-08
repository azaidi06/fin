import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Production builds deploy to /capex/ as a sub-app under fin/_site.
// Use VITE_BASE=/ for standalone hosting.
const base = process.env.VITE_BASE ?? '/capex/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
})
