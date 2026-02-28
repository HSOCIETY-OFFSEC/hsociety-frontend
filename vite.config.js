// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'hsociety-logo-black.png',
        'hsociety-logo-white.png'
      ],
      manifest: {
        name: 'Hsociety - Elite Offensive Security',
        short_name: 'Hsociety',
        description:
          'Professional penetration testing and security assessment platform.',
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          icons: ['react-icons']
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
