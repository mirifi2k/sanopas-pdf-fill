import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Set VITE_BASE_PATH to /your-repo-name/ for GitHub project pages.
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
})
