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
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          leaflet: ['leaflet'],
          turf: ['@turf/turf']
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['@turf/turf']
  }
});
