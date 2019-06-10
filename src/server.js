/* eslint-disable no-param-reassign */
require('./database/database');
// eslint-disable-next-line import/order
const app = require('./app');

const server = require('http').Server(app);

const WebSocket = require('ws');

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

  socket.on('message', (data) => {
    const content = JSON.parse(data);

    switch (content.action) {
      case 'addProvider':
        if (addedUser) return;

        socket.userName = content.user.userName; // Nome
        socket.type = 'provider';
        socket.dbId = content.user.dbId; // Id salvo no banco
        socket.id = n; // Id respectivo para o socket
        n += 1;

        providers.push({
          id: socket.id,
          userName: socket.userName,
          dbId: socket.dbId,
          socket,
        });

        clients.forEach((client) => {
          ws.clients.forEach((sClient) => {
            if (sClient.id === client.id) {
              sClient.send(JSON.stringify({
                listener: 'providers',
                providers: providers.map(provider => ({ id: provider.dbId, socketId: socket.id })),
              }));
            }
          });
        });

        socket.send(JSON.stringify({ listener: 'addProvider', message: true }));
        addedUser = true;

        break;

      case 'addClient':

        if (addedUser) return;

        socket.userName = content.user.userName; // Nome
        socket.type = 'client';
        socket.dbId = content.user.dbId; // Id de armazenamento no banco
        socket.id = n; // Id respectivo para o socket

        n += 1;

        clients.push({
          id: socket.id,
          userName: socket.userName,
          dbId: socket.dbId,
          socket,
        });

        socket.send(JSON.stringify({ listener: 'providers', providers }));
        addedUser = true;

        break;

      case 'newService':
        providers.forEach((provider) => {
          if (provider.id === content.user.providerId) {
            ws.clients.forEach((sProvider) => {
              if (sProvider.id === provider.id) {
                sProvider.send(JSON.stringify({
                  listener: 'newService',
                  user: {
                    id: socket.id,
                    userName: socket.userName,
                    dbId: socket.dbId,
                  },
                }));
              }
            });
          }
        });

        break;

      case 'acceptService':
        clients.forEach((client) => {
          if (client.id === content.user.clientId) {
            ws.clients.forEach((sClient) => {
              if (sClient.id === client.id) {
                sClient.send(JSON.stringify({
                  listener: 'acceptService',
                  user: {
                    id: socket.id,
                    userName: socket.userName,
                    dbId: socket.dbId,
                  },
                }));
              }
            });
          }
        });
        break;

      case 'cancelService':
        providers.forEach((provider) => {
          if (provider.id === content.user.providerId) {
            ws.clients.forEach((sProvider) => {
              if (sProvider.id === provider.id) {
                sProvider.send(JSON.stringify({
                  listener: 'cancelService',
                  user: {
                    id: socket.id,
                    userName: socket.userName,
                    dbId: socket.dbId,
                  },
                }));
              }
            });
          }
        });

        break;

      case 'denyService':
        clients.forEach((client) => {
          if (client.id === content.user.clientId) {
            ws.clients.forEach((sClient) => {
              if (sClient.id === content.user.clientId) {
                sClient.send(JSON.stringify({
                  listener: 'denyService',
                  user: {
                    id: socket.id,
                    userName: socket.userName,
                    dbId: socket.dbId,
                  },
                }));
              }
            });
          }
        });

        break;

      case 'messageForProvider':

        providers.forEach((provider) => {
          if (provider.id === content.user.providerId) {
            provider.socket.send(JSON.stringify({
              listener: 'messageForProvider',
              content: {
                dbId: socket.id,
                userName: socket.userName,
                message: content.message,
              },
            }));
          }
        });

        break;

      case 'messageForClient':

        clients.forEach((client) => {
          if (client.id === content.user.clientId) {
            ws.clients.forEach((sClient) => {
              if (sClient.id === content.user.clientId) {
                sClient.send(JSON.stringify({
                  listener: 'messageForClient',
                  content: {
                    dbId: socket.id,
                    userName: socket.userName,
                    message: content.message,
                  },
                }));
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
          sClient.send(JSON.stringify({
            listener: 'providers',
            providers,
          }));
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
