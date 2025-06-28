import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/DocCollab.github.io/', // 👈 this should match your repo name
  plugins: [react()],
});
