import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        interop: 'auto',
      },
      // external: ['@paymoapp/active-window', // HERE you define that you won't like this lib to get bundled
      //   ...builtinModules.flatMap(p => [p, `node:${p}`])],
    },
  },
});
