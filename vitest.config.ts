import { configDefaults, defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
// import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      modules: fileURLToPath(new URL('./modules', import.meta.url)),
      shared: fileURLToPath(new URL('./shared', import.meta.url)),
      // src: path.resolve(
      //   path.dirname(fileURLToPath(import.meta.url)),
      //   './src'
      // ),
    },
  },
  test: {
    exclude: [...configDefaults.exclude],
  },
});
