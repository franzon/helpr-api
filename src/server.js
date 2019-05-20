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
  console.log('nova conexão');

  socket.on('message', (data) => {
    const content = JSON.parse(data);
    console.log(content);
    switch (content.action) {
      case 'add provider':
        if (addedUser) return;

        // eslint-disable-next-line no-param-reassign
        socket.userName = content.user.userName;
        // eslint-disable-next-line no-param-reassign
        socket.tipe = 'provider';
        // eslint-disable-next-line no-param-reassign
        socket.userId = content.user.userId;
        // eslint-disable-next-line no-param-reassign
        socket.id = n;

        n += 1;

        providers.push({
          id: socket.id,
          userName: socket.userName,
          userId: socket.userId,
        });
        console.log(`providers ${JSON.stringify(providers)}`);
        clients.forEach((client) => {
          ws.clients.forEach((sClient) => {
            if (sClient.id === client.id) {
              sClient.send({ listener: 'providers', providers });
            }
          });
        });

        socket.send(JSON.stringify({ listener: 'add provider', message: true }));
        addedUser = true;

        break;

      case 'add client':

        if (addedUser) return;

        // eslint-disable-next-line no-param-reassign
        socket.userName = content.user.userName;
        // eslint-disable-next-line no-param-reassign
        socket.tipe = 'client';
        // eslint-disable-next-line no-param-reassign
        socket.userId = content.user.userId;
        // eslint-disable-next-line no-param-reassign
        socket.id = n;

        n += 1;

        clients.push({
          id: socket.id,
          userName: socket.userName,
          userId: socket.userId,
        });

        addedUser = true;

        break;

      case 'new service':
        providers.forEach((provider) => {
          if (provider.id === content.user.providerId) {
            socket.broadcast.to(provider.id).emit('new service', {
              id: socket.id,
              userName: socket.userName,
              userId: socket.userId,
            });
          }
        });

        break;

      default:
        break;
    }
  });
  /*
  socket.on('accept service', (user) => {
    clients.forEach((client) => {
      if (client.id === user.clientId) {
        socket.broadcast.to(client.id).emit('confirm service', {
          id: socket.id,
          userName: socket.userName,
          userId: socket.userId,
        });
      }
    });
  });

  socket.on('cancel service', (user) => {
    providers.forEach((provider) => {
      if (provider.id === user.providerId) {
        socket.broadcast.to(provider.id).emit('cancel service', {
          id: socket.id,
          userName: socket.userName,
          userId: socket.userId,
        });
      }
    });
  });

  socket.on('deny service', (user) => {
    clients.forEach((client) => {
      if (client.id === user.clientId) {
        socket.broadcast.to(client.id).emit('deny service', {
          id: socket.id,
          userName: socket.userName,
          userId: socket.userId,
        });
      }
    });
  });

  socket.on('message', (content) => {
    socket.broadcast.to(data.userId).emit('message', { id: socket.id, message: data.message });
  });
*/
  socket.on('disconnect', () => {
    if (socket.tipe === 'provider') {
      providers.forEach((it, index) => {
        if (it.id === socket.id) {
          providers.pop(index);
        }
      });

      clients.forEach((client) => {
        socket.broadcast.to(client.id).emit('providers', providers);
      });
    }

    if (socket.tipe === 'client') {
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
});
