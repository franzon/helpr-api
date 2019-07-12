/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
require('./database/database');

const url = require('url');
// eslint-disable-next-line import/order
const app = require('./app');

const server = require('http').Server(app);

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const keys = require('./utils/keys.json');

const verifyClient = (info, done) => {
  const { query } = url.parse(info.req.url, true);
  jwt.verify(query.token, keys.jwt, (err) => {
    if (err) return done(false, 403, 'invalid token');
    return done(true);
  });
};

const ws = new WebSocket.Server({ server });

const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at ${host}:${port}`);
});

const providers = [];
const clients = [];

let n = 0;

ws.on('connection', (socket) => {
  let addedUser = false;

  let providerListener = {};

  socket.on('message', (data) => {
    const content = JSON.parse(data);
    console.log(content);

    switch (content.action) {
      case 'add':
        if (addedUser) return;
        socket.userName = content.user.userName;
        socket.type = content.user.type;
        socket.dbId = content.user.dbId;
        socket.id = n;

        n += 1;

        if (socket.type === 'provider') {
          providers.push({
            id: socket.id,
            userName: socket.userName,
            dbId: socket.dbId,
            socket,
          });
        }
        providerListener = {
          listener: 'providers',
          providers: providers.map(provider => ({
            id: provider.dbId,
            socketId: socket.id,
          })),
        };
        if (socket.type === 'provider') {
          clients.forEach((client) => {
            client.socket.send(JSON.stringify(providerListener));
          });
          socket.send(JSON.stringify({ connected: 'true' }));
        } else if (socket.type === 'client') {
          clients.push({
            id: socket.id,
            userName: socket.userName,
            dbId: socket.dbId,
            socket,
          });
          socket.send(JSON.stringify(providerListener));
        }
        addedUser = true;
        break;

      case 'newService':
        socket.userLocation = content.userLocation;
        socket.service = content.service;
        providers.forEach((provider) => {
          if (provider.id === content.user.providerId) {
            provider.socket.send(
              JSON.stringify({
                listener: 'newService',
                user: {
                  id: socket.id,
                  userName: socket.userName,
                  dbId: socket.dbId,
                },
                userLocation: socket.userLocation,
                service: socket.service,
                userLocation: {
                  longitude: content.userLocation.longitude,
                  latitude: content.userLocation.latitude,
                },
              }),
            );
          }
        });

        break;

      case 'acceptService':
        clients.forEach((client) => {
          if (client.id === content.user.id) {
            client.socket.send(
              JSON.stringify({
                listener: 'acceptService',
                user: {
                  id: socket.id,
                  userName: socket.userName,
                  dbId: socket.dbId,
                },
              }),
            );
          }
        });
        break;

      case 'cancelService':
        providers.forEach((provider) => {
          if (provider.id === content.user.providerId) {
            provider.socket.send(
              JSON.stringify({
                listener: 'cancelService',
                user: {
                  id: socket.id,
                  userName: socket.userName,
                  dbId: socket.dbId,
                },
              }),
            );
          }
        });

        break;

      case 'denyService':
        clients.forEach((client) => {
          if (client.id === content.user.id) {
            client.socket.send(
              JSON.stringify({
                listener: 'denyService',
                user: {
                  id: socket.id,
                  userName: socket.userName,
                  dbId: socket.dbId,
                },
              }),
            );
          }
        });

        break;

      case 'messageForProvider':
        providers.forEach((provider) => {
          if (provider.id === content.user.providerId) {
            provider.socket.send(
              JSON.stringify({
                listener: 'messageForProvider',
                content: {
                  id: socket.id,
                  dbId: socket.dbId,
                  userName: socket.userName,
                  message: content.message,
                },
              }),
            );
          }
        });

        break;

      case 'messageForClient':
        clients.forEach((client) => {
          if (client.id === content.user.clientId) {
            ws.clients.forEach((sClient) => {
              if (sClient.id === content.user.clientId) {
                sClient.send(
                  JSON.stringify({
                    listener: 'messageForClient',
                    content: {
                      dbId: socket.id,
                      userName: socket.userName,
                      message: content.message,
                    },
                  }),
                );
              }
            });
          }
        });

        break;

      default:
        break;
    }
  });
});
ws.on('close', (socket) => {
  if (socket.type === 'provider') {
    providers.forEach((it, index) => {
      if (it.id === socket.id) {
        providers.pop(index);
      }
    });

    clients.forEach((client) => {
      ws.clients.forEach((sClient) => {
        if (sClient.id === client.id) {
          sClient.send(
            JSON.stringify({
              listener: 'providers',
              providers,
            }),
          );
        }
      });
    });
  }

  if (socket.type === 'client') {
    clients.forEach((it, index) => {
      if (it.id === socket.id) {
        clients.pop(index);
      }
    });
  }

  console.log('providers: ');

  providers.forEach((provider) => {
    console.log(JSON.stringify(provider));
  });

  console.log('clients: ');

  clients.forEach((client) => {
    console.log(JSON.stringify(client));
  });

  // eslint-disable-next-line no-console
  console.log(`disconnected ${socket.id}`);
});
