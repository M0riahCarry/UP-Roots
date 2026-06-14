import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // forward /api requests to the backend during development, so the browser
    // sees one origin and there are no cross-origin (CORS) issues
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
})
