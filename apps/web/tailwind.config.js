/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./app/**/*.tsx', './pages/**/*.tsx', './lib/components/**/*.tsx'],
    theme: {
        fontSize: {
            ...require('tailwindcss/defaultTheme').fontSize,
            '1.5xl': '1.30rem',
        }
    },
    plugins: [],
    safelist: [
        {
            // colours
            pattern: /(bg|text|border)-(neutral|sky|white|black)(-\d+0)?/,
            variants: ['dark', 'dark:hover', 'hover'],
        },
        {
            // translate
            pattern: /-?translate-(x|y)-(\d+|full)/,
            variants: ['dark', 'dark:hover', 'hover'],
        },
        {
            // shadow
            pattern: /shadow-(sm|md|lg|xl|2xl|inner|outline|none)/,
            variants: ['dark', 'dark:hover', 'hover'],
        },
        {
            // brightness
            pattern: /-?brightness-\d+/,
            variants: ['dark', 'dark:hover', 'hover'],
        },
    ]
};
