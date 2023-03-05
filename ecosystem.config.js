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
        name: 'Qwaroo CDN',
        cwd: './apps/cdn',
        script,
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
    },
    {
        name: 'Qwaroo Discord',
        cwd: './apps/discord',
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
