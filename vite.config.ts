import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/patchies-goodies/',
  server: {
    port: 5062,
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          crawlLinks: true,
        },
      },
      sitemap: {
        host: 'https://github.com',
      },
      prerender: {
        failOnError: false,
      },
    }),
    viteReact(),
  ],
})
