import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      // your existing external config, etc.
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
