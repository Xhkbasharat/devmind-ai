
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/ai": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/analysis": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/projects": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/reviews": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/github": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  },

  build: {
    outDir: "dist",
    sourcemap: false
  }
});
