const path = require('path');

module.exports = {
  main: {
    entry: 'src/main/index.ts',
    vite: {
      build: {
        outDir: 'dist/main',
        rollupOptions: {
          input: 'src/main/index.ts',
        },
      },
    },
  },
  preload: {
    input: 'src/main/preload.ts',
    vite: {
      build: {
        outDir: 'dist/main',
      },
    },
  },
  renderer: {
    vite: {
      root: path.resolve(__dirname),
      build: {
        outDir: 'dist/renderer',
      },
    },
  },
};
