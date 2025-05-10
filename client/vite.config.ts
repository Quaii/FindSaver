import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Enable if needed for platform-specific issues
      // target: 'es2020'
    }
  },
  build: {
    // Ensure builds work across different environments
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})