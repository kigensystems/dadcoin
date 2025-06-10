import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Include only necessary polyfills
      include: ['buffer', 'crypto', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // Provides polyfills for Node.js core modules
      buffer: 'buffer',
    },
  },
  define: {
    // Define global for browser compatibility
    global: 'globalThis',
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});