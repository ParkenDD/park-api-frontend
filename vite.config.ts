import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // MapLibre alone is about 1 MB. It is split into the lazily loaded map chunk, which is as small as it gets.
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
