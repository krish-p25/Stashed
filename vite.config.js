import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,
        allowedHosts: ['stashedmedia.krishrp.xyz'],
        proxy: { '/api': 'http://127.0.0.1:3002' },
        headers: { 'Cache-Control': 'no-store' },
    },
})
