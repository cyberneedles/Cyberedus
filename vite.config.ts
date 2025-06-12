import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), runtimeErrorOverlay()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./client/src"),
      "@components": resolve(__dirname, "./client/src/components"),
      "@pages": resolve(__dirname, "./client/src/pages"),
      "@lib": resolve(__dirname, "./client/src/lib"),
      "@hooks": resolve(__dirname, "./client/src/hooks"),
      "@shared": resolve(__dirname, "../shared"),
      "@assets": resolve(__dirname, "../attached_assets"),
    },
  },
  root: resolve(__dirname, "./client"),
  build: {
    outDir: resolve(__dirname, "../dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@headlessui/react', '@heroicons/react'],
          'utils': ['axios', 'date-fns', 'nanoid']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
