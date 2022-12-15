import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs'],
    minify: true,
    skipNodeModulesBundle: true,
    target: 'esnext',
});
