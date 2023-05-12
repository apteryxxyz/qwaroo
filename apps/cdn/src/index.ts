import { Server, getEnv } from '@qwaroo/server';

require('dotenv-expand').expand(require('dotenv').config());

const server = new Server();

void main();
async function main() {
    server.routers.push(require('./routes/fs').default());
    server.app.use(require('express').text({ limit: '50mb' }));
    server.setOnError((err, _req, res) => res.status(err.status).end());

    await server.listen(getEnv(Number, 'CDN_PORT'));
}

export { server };
