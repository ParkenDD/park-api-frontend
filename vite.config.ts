import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // The end-to-end tests expect the defaults of src/lib/config.ts, which a local .env must not override.
  envDir: mode === 'e2e' ? false : undefined,
  build: {
    // MapLibre alone is about 1 MB. It is split into the lazily loaded map chunk, which is as small as it gets.
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 5173,
    // geocode.park-api.de allows CORS for park-api.de only, so the dev server passes the place search on to it.
    proxy: {
      '/geocode': {
        target: 'https://geocode.park-api.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geocode/, ''),
      },
    },
  },
  preview: {
    port: 4173,
  },
}));
