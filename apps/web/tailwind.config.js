/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./app/**/*.tsx', './pages/**/*.tsx', './lib/components/**/*.tsx'],
    theme: {
        extend: {
            maxWidth: {
                '8xl': '90rem',
            },
            fontSize: {
                '1.5xl': '1.30rem',
            },
            colors: {
                'owenii': {
                    '50': '#eff6ff',
                    '100': '#dbebfe',
                    '200': '#bedcff',
                    '300': '#92c7fe',
                    '400': '#5ea8fc',
                    '500': '#3884f8',
                    '600': '#2365ed',
                    '700': '#1b50da',
                    '800': '#1c41b1',
                    '900': '#1d3b8b',
                },
            }
        }
    },
    plugins: [],
    safelist: [
        {
            // colours
            pattern: /(bg|text|border)-(neutral|owenii|sky|white|black)(-\d+0)?/,
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
