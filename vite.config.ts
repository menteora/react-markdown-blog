import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { ssgPlugin } from '@wroud/vite-plugin-ssg';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/react-markdown-blog/',
      plugins: [ssgPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.')
        }
      },
      server: {
        port: 3000,
        host: true
      },
      build: {
        target: 'esnext',
        rollupOptions: {
          input: {
            index: path.resolve(__dirname, 'index.tsx') + '?ssg-entry'
          }
        }
      },
      appType: 'mpa'
    };
});
