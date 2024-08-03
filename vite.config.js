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
  base: '/study_camp_r_client/',
  // define: {
  //   'process.env.PUBLIC_URL': process.env.PUBLIC_URL,
  // },
});
