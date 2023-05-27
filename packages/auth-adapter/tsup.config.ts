import { esbuildDecorators } from '@anatine/esbuild-decorators';
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs'],
    target: 'esnext',
    minify: true,
    dts: true,
    skipNodeModulesBundle: true,
    // @ts-expect-error Need decorators
    esbuildPlugins: [esbuildDecorators()],
});
