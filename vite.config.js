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
        target: 'https://pms.advtinni.com',
        changeOrigin: true,
        secure: false,
      },
      '/printview': {
        target: 'https://pms.advtinni.com',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        target: 'https://pms.advtinni.com',
        changeOrigin: true,
        secure: false,
      },
      '/private': {
        target: 'https://pms.advtinni.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
