import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // The PayFlow API is served by the Express backend on port 3000.
    // Proxying in dev keeps requests same-origin (no CORS round trips) and
    // means the app can always talk to the relative /api/v1 base URL.
    // For a deployed build, set VITE_API_URL to the absolute API base instead.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
