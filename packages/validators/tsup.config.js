module.exports = {
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'esnext',
  minify: true,
  dts: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
};
