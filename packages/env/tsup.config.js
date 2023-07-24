module.exports = {
  entry: ['core.ts'],
  format: ['cjs'],
  target: 'esnext',
  outDir: '.',
  minify: true,
  dts: true,
  bundle: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
};
