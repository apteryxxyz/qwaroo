import { Database } from '@qwaroo/database';
import { Server, getEnv } from '@qwaroo/server';

require('dotenv-expand').expand(require('dotenv').config());

const database = new Database();
const server = new Server();

void main();
async function main() {
    server.routers.push(require('./routes/auth').default());
    server.routers.push(require('./routes/games').default());
    server.routers.push(require('./routes/internal').default());
    server.routers.push(require('./routes/scores').default());
    server.routers.push(require('./routes/users').default());

    await database.connect(getEnv(String, 'MONGODB_URI'));
    await server.listen(getEnv(Number, 'API_PORT'));
}

export { database, server };

export { migrate } from './migrate';
