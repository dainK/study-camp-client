import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      input: ['./index.html'],
    },
  },
  // server: {
  //   hmr: false, // HMR 파일 생성 비활성화
  // },
  // base: '/study-camp-client/',
  // define: {
  //   'process.env.PUBLIC_URL': process.env.PUBLIC_URL,
  // },
  server: {
    port: parseInt(process.env.VITE_PORT, 10) || 8000,
    proxy: {
      '/socket.io': {
        target: process.env.VITE_SERVER_URL || 'http://localhost:4000', // Socket.io 서버 주소
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
