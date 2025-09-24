// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: {
      origin: "*",
      credentials: true
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['leaflet', '@turf/turf'],
      output: {
        globals: {
          'leaflet': 'L',
          '@turf/turf': 'turf'
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Minify for production - temporarily disable console dropping for debugging
    minify: 'terser',
    terserOptions: {
      compress: {
        // drop_console: true, // Commented out for debugging
        // drop_debugger: true
      }
    }
  },
  // Define global constants and globals for external dependencies
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    global: 'globalThis',
  },
  // Dependencies are loaded via CDN, so no optimization needed
});
