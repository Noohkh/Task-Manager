import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path - using your repository name
const base = process.env.GITHUB_PAGES ? '/Task-Manager/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        taskmanager: './taskmanager.html'
      }
    }
  }
});