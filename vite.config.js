import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['tools-icon.svg'],
      manifest: {
        name: 'Preço Certo Marido de Aluguel',
        short_name: 'Preço Certo',
        description: 'Calculadora de orçamento para marido de aluguel',
        theme_color: '#0d47a1',
        background_color: '#F5F7FA',
        display: 'standalone',
        icons: [
          {
            src: 'tools-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
