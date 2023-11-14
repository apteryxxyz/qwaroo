/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('@qwaroo/tailwind-config/base')],
  plugins: [require('tailwindcss-animate')],
};

/*
public/
  games/
    mrbeast-video-views/
      data.json -> Game
      items.json -> Item[]
      source.json -> Source
*/
