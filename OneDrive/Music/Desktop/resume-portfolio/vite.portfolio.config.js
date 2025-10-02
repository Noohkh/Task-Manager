import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path - using your repository name
const base = process.env.GITHUB_PAGES ? '/Task-Manager/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist-portfolio',
  }
});