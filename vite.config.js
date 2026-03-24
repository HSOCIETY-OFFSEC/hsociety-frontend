// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const publicHandleRewrite = () => ({
  name: 'public-handle-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || '';
      if (
        url.startsWith('/@') &&
        !url.startsWith('/@vite') &&
        !url.startsWith('/@id') &&
        !url.startsWith('/@fs') &&
        !url.startsWith('/@react-refresh')
      ) {
        req.url = '/index.html';
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || '';
      if (
        url.startsWith('/@') &&
        !url.startsWith('/@vite') &&
        !url.startsWith('/@id') &&
        !url.startsWith('/@fs') &&
        !url.startsWith('/@react-refresh')
      ) {
        req.url = '/index.html';
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [
    publicHandleRewrite(),
    react(),

    VitePWA({
      injectRegister: null,
      registerType: 'prompt',
      includeAssets: [
        'hsociety-logo-black.png',
        'hsociety-logo-white.png'
      ],
      manifest: {
        name: 'HSOCIETY OFFSEC — Offensive Security Training & Penetration Testing',
        short_name: 'HSOCIETY',
        description:
          'HSOCIETY OFFSEC delivers offensive security training, supervised penetration testing, and a cybersecurity pipeline for teams and emerging operators.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/FAVICON_HSOCIETY_BLACK/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/FAVICON_HSOCIETY_BLACK/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  server: {
    port: 5173,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true
      }
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return null;
          if (id.includes('react-icons')) return 'icons';
          if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('/react/')) {
            return 'react-vendor';
          }
          if (
            id.includes('three/build/three.module') ||
            id.includes('/three/src/')
          ) {
            return 'three-core';
          }
          if (id.includes('@react-three/fiber')) {
            return 'r3f-vendor';
          }
          if (id.includes('@react-three/drei')) {
            return 'drei-vendor';
          }
          if (id.includes('framer-motion')) return 'motion-vendor';
          return undefined;
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@context': '/src/context',
      '@config': '/src/config',
      '@styles': '/src/styles'
    }
  },

  preview: {
    port: 4173,
    open: true
  }
})
