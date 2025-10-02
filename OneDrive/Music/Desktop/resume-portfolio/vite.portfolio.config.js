import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path - replace 'resume-portfolio' with your repo name
const base = process.env.GITHUB_PAGES ? '/resume-portfolio/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist-portfolio',
  }
});