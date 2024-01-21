import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server:{
            proxy: {
                '/dev-api': {
                  target: 'http://49.232.128.232',
                  changeOrigin: true,
                  rewrite: (path) => path.replace(/^\/dev-api/, ''),
                },
              },
        }
    };
});
