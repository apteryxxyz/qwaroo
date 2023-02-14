const { readFile, writeFile, mkdir } = require('node:fs/promises');
const { dirname } = require('node:path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const copyOptions = [{
    directory: 'apps/api',
    env: '.env',
    from: 'nginx.conf',
    to: 'api.qwaroo.com',
}, {
    directory: 'apps/cdn',
    env: '.env',
    from: 'nginx.conf',
    to: 'cdn.qwaroo.com',
}, {
    directory: 'apps/web',
    env: '.env',
    from: 'nginx.conf',
    to: 'qwaroo.com',
}];

void main(process.argv.length, process.argv);
async function main(_0, _1) {
    for (const options of copyOptions) {
        const { directory, env, from, to } = options;

        const envPath = `${directory}/${env}`;
        const envContent = await readFile(envPath, 'utf8');
        const envConfig = dotenvExpand.expand(
            dotenv.parse(envContent));

        const confPath = `${directory}/${from}`;
        const originalContent = await readFile(confPath, 'utf8');
        const content = originalContent.replaceAll(/\${(\w+)}/g,
            (match, variable) => envConfig[variable]);

        const confPathTo = `.nginx/${to}`;
        await mkdir(dirname(confPathTo), { recursive: true });
        await writeFile(confPathTo, content);

        console.info(`Copied ${confPath} to ${confPathTo}`);
    }

    console.info('Done!');
    console.info('Please run `sudo cp .nginx/* /etc/nginx/sites-available`.');
    console.info('Then `sudo cp /etc/nginx/sites-available/* /etc/nginx/sites-enabled`.');
    console.info('And finally `sudo nginx -t && sudo systemctl restart nginx`.');
}
