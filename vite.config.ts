import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'Components': fileURLToPath(new URL('./src/Components', import.meta.url)),
      'slices': fileURLToPath(new URL('./src/slices', import.meta.url)),
      'pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      'helpers': fileURLToPath(new URL('./src/helpers', import.meta.url)),
      'assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      'config': fileURLToPath(new URL('./src/config', import.meta.url)),
      'store': fileURLToPath(new URL('./src/store', import.meta.url)),
      'services': fileURLToPath(new URL('./src/services', import.meta.url)),
      'types': fileURLToPath(new URL('./src/types', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://localhost:44301',
        changeOrigin: true,
        secure: false, // allows self-signed dev certs
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
  },
});
