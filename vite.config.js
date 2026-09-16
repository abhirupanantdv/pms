import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-to-pms',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Redirect root "/" and "/pms" to "/assets/pms/"
          if (req.url === '/' || req.url === '' || req.url === '/pms' || req.url === '/pms/') {
            res.writeHead(302, { Location: '/assets/pms/' });
            res.end();
            return;
          }
          // Redirect legacy "/assets/pms/dist" requests to "/assets/pms"
          if (req.url?.startsWith('/assets/pms/dist')) {
            const redirectUrl = req.url.replace('/assets/pms/dist', '/assets/pms');
            res.writeHead(302, { Location: redirectUrl });
            res.end();
            return;
          }
          next();
        });
      }
    }
  ],
  base: '/assets/pms/',
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
        target: 'http://192.168.101.180:8980',
        changeOrigin: true,
        secure: false,
      },
      '/printview': {
        target: 'http://192.168.101.180:8980',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        target: 'http://192.168.101.180:8980',
        changeOrigin: true,
        secure: false,
      },
      '/private': {
        target: 'http://192.168.101.180:8980',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
