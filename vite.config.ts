import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { ssgPlugin } from '@wroud/vite-plugin-ssg';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/react-markdown-blog/',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@google/genai': path.resolve(__dirname, 'utils/genai-stub.ts'),
        }
      },
      plugins: [ssgPlugin()],
      build: {
        target: 'esnext',
        rollupOptions: {
          input: {
            index: path.resolve(__dirname, 'index.tsx') + '?ssg-entry'
          }
        }
      },
      appType: 'mpa',
      server: {
        port: 3000,
        host: true // oppure '0.0.0.0'
      },
    };
});
