import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      overlay: true,
      port: 5173,
    },
  },
});
