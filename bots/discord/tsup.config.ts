import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    entry: ['src/index.ts', 'src/**/**/*.ts'],
    format: ['cjs'],
    bundle: false,
    minify: true,
    skipNodeModulesBundle: true,
    target: 'es2020',
    keepNames: true,
});
