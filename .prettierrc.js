/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  tailwindConfig: './packages/config/tailwind/base.js',
  importOrder: [
    '^@qwaroo/(.*)$',
    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(next/(.*)$)|^(next$)',
    '^(expo(.*)$)|^(expo$)',
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/styles/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  singleQuote: true,
};
