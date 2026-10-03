import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: false,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Media lives in /public and is served as-is, so no asset inlining surprises.
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        // Split React into its own long-lived chunk so app edits don't
        // invalidate it in the visitor's cache.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react';
          }
        },
      },
    },
  },
});
