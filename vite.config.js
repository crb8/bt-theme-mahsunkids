import { defineConfig } from "vite";

export default {
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "./src/theme/bt-overrides.mahsunkids.v1.css",
      output: {
        // Gera nome estável para CDN com sufixo ".v1"
        assetFileNames: "bt-overrides.mahsunkids.v1[extname]",
      },
    },
  },
};