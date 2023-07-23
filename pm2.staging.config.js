const script =
  process.platform === 'win32' ? '../../scripts/npm-windows.js' : 'npm';

module.exports = [
  {
    name: 'Qwaroo Staging',
    cwd: './apps/www',
    script,
    args: 'run start',
    instances: 1,
    autorestart: true,
    watch: false,
  },
];
