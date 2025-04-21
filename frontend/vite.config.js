import path from 'path';
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: './src/setup.js',
  // },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.js',
    // deps: {
    //   inline: ['vitest-canvas-mock'],
    // },
    threads: false,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
  server: {
    port: 3000,
  },
})
