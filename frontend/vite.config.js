import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Only accounts and bookings go to the backend
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } }
  }
});
