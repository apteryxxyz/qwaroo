const script = process.platform === 'win32'
    ? '../../scripts/npm.js' : 'npm';

module.exports = [
    {
        name: 'Owenii API',
        cwd: './apps/api',
        script,
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
    },
    {
        name: 'Owenii Web',
        cwd: './apps/web',
        script,
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
    }
]