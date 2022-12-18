module.exports = [
    {
        name: 'Owenii API',
        cwd: './apps/api',
        script: './scripts/npm.js',
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
    },
    {
        name: 'Owenii Web',
        cwd: './apps/web',
        script: './scripts/npm.js',
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
    }
]