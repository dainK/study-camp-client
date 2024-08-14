import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: '',
      rollupOptions: {
        input: ['./index.html'],
      },
    },
    define: {
      'process.env.VITE_PORT': JSON.stringify(env.VITE_PORT),
      'process.env.VITE_CLIENT_URL': JSON.stringify(env.VITE_CLIENT_URL),
      'process.env.VITE_SERVER_URL': JSON.stringify(env.VITE_SERVER_URL),
      'process.env.VITE_GITHUB_PAGE': JSON.stringify(env.VITE_GITHUB_PAGE),
    },
    server: {
      port: parseInt(env.VITE_PORT, 10),
      proxy: {
        '/socket.io': {
          target: env.VITE_SERVER_URL,
          ws: true,
          changeOrigin: true,
        },
      },
    },
    //base: '/study-camp-client/',
  });
};
