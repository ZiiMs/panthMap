import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        interop: 'auto',
      },
      external: ['@paymoapp/active-window'],
    },
  },
});
