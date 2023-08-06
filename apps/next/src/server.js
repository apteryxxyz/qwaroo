const service = require('ts-node').register();
const { Database } = require('@qwaroo/database');
const { WebSocketServer } = require('ws');
const { prepareWebSocketServer } = require('./utilities/wss');
service.enabled(false);

module.exports = async ({ httpServer }) => {
  await Database.getInstance().connect();
  const wsServer = new WebSocketServer({ noServer: true });
  prepareWebSocketServer(httpServer, wsServer);
};
