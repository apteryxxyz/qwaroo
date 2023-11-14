/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  settings: {
    react: { version: 'detect' },
  },
  globals: {
    React: 'writable',
  },
  rules: {
    'react/prop-types': 'off',
  },
};
