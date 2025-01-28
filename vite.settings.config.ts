import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/renderer"),
    },
  },
  root: path.join(__dirname, "src", "renderer", "settings"),
});
