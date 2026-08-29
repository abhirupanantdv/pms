import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/assets/pms/dist/',
  build: {
    outDir: path.resolve(__dirname, 'pms/public/dist'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    }
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://182.71.135.110:8610',
        changeOrigin: true,
        secure: false,
      },
      '/printview': {
        target: 'http://182.71.135.110:8610',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        target: 'http://182.71.135.110:8610',
        changeOrigin: true,
        secure: false,
      },
      '/private': {
        target: 'http://182.71.135.110:8610',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
