import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], build: { rollupOptions: { output: { manualChunks: { 'avatar-design': ['@dicebear/core', '@dicebear/adventurer'] } } } }, base: './', server: { proxy: { '/api': 'http://localhost:8080', '/healthz': 'http://localhost:8080' } } });
