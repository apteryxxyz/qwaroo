const script = process.platform === 'win32'
    ? '../../scripts/npm.js' : 'npm';

module.exports = [
    {
        name: 'Qwaroo API',
        cwd: './apps/api',
        script,
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
    },
    {
        name: 'Qwaroo Web',
        cwd: './apps/web',
        script,
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
    },
];
