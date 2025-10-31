import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        boot: 'src/boot/index.js',
        theme: 'src/theme/bt-overrides.mahsunkids.v1.css',
      },
      output: {
        format: 'es',
        entryFileNames: chunkInfo => {
          if (chunkInfo.name === 'boot') {
            return 'bt-boot.mahsunkids.v1.js';
          }
          return '[name].js';
        },
        chunkFileNames: 'chunks/mahsunkids-[name].js',
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'bt-overrides.mahsunkids.v1.css';
          }
          return 'assets/[name][extname]';
        },
        inlineDynamicImports: false,
      },
    },
  },
});
