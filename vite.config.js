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
          // Redirect favicon requests directly to configured favicon url
          if (
            req.url === '/favicon.ico' ||
            req.url === '/favicon.svg' ||
            req.url?.startsWith('/favicon.ico?') ||
            req.url?.startsWith('/favicon.svg?') ||
            req.url?.startsWith('/assets/pms/favicon.ico') ||
            req.url?.startsWith('/assets/pms/favicon.svg')
          ) {
            res.writeHead(302, { Location: 'https://pms.advtinni.com/files/Screenshot%202026-05-11%20151414.png' });
            res.end();
            return;
          }

          // Redirect root "/" to "/pms"
          if (req.url === '/' || req.url === '') {
            res.writeHead(302, { Location: '/pms' });
            res.end();
            return;
          }

          // Support /pms without redirecting away: rewrite internally to /assets/pms/
          if (req.url === '/pms' || req.url === '/pms/' || req.url?.startsWith('/pms?') || req.url?.startsWith('/pms/')) {
            const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
            req.url = '/assets/pms/' + query;
            next();
            return;
          }

          // Support /assets/pms without trailing slash: rewrite to /assets/pms/
          if (req.url === '/assets/pms' || req.url?.startsWith('/assets/pms?')) {
            const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
            req.url = '/assets/pms/' + query;
            next();
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
      '/app': {
        target: 'https://cfpl.anantdv.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      '/assets/apps': {
        target: 'https://cfpl.anantdv.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      '/apps': {
        target: 'https://cfpl.anantdv.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      '/api': {
        target: 'https://cfpl.anantdv.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      '/printview': {
        target: 'https://cfpl.anantdv.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      '/files': {
        target: 'https://cfpl.anantdv.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      '/private': {
        target: 'https://cfpl.anantdv.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      }
    }
  }
})
