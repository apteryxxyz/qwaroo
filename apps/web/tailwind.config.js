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
                'qwaroo': {
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
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                },
                scale: {
                    '0%': { transform: 'scale(.98)' },
                    '50%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(.98)' },
                },
                'spin-slow': {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '50%': { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
                scale: 'scale 3s ease-in-out infinite',
                'spin-slow': 'spin-slow 10s linear infinite',
            },
        },
    },
    plugins: [],
    safelist: [
        {
            // colours
            pattern: /(bg|text|border)-(neutral|qwaroo|white|black)(-\d+0)?/,
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
        {
            // other
            pattern: /hidden|!min-h-screen/,
            variants: ['dark', 'dark:hover', 'hover'],
        }
    ]
};
