require('./database/database');
// eslint-disable-next-line import/order
const app = require('./app');

const server = require('http').Server(app);

const io = require('socket.io')(server, {
  path: '/users',
});

const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at ${host}:${port}`);
});

const providers = [];
const clients = [];

io.on('connection', (socket) => {
  let addedUser = false;

  socket.on('add provider', (user) => {
    if (addedUser) return;

    // eslint-disable-next-line no-param-reassign
    socket.userName = user.userName;
    // eslint-disable-next-line no-param-reassign
    socket.tipe = 'provider';
    // eslint-disable-next-line no-param-reassign
    socket.userId = user.id;

    providers.push({
      id: socket.id,
      userName: socket.userName,
      userId: socket.userId,
    });

    clients.forEach((client) => {
      socket.broadcast.to(client.id).emit('providers', providers);
    });

    addedUser = true;
  });

  socket.on('add client', (user) => {
    if (addedUser) return;

    // eslint-disable-next-line no-param-reassign
    socket.userName = user.userName;
    // eslint-disable-next-line no-param-reassign
    socket.tipe = 'client';
    // eslint-disable-next-line no-param-reassign
    socket.userId = user.id;

    clients.push({
      id: socket.id,
      userName: socket.userName,
      userId: socket.userId,
    });

    addedUser = true;
  });

  socket.on('new service', (user) => {
    providers.forEach((provider) => {
      if (provider.id === user.providerId) {
        socket.broadcast.to(provider.id).emit('new service', {
          id: socket.id,
          userName: socket.userName,
          userId: socket.userId,
        });
      }
    });
  });

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

  socket.on('message', (data) => {
    socket.broadcast.to(data.userId).emit('message', { id: socket.id, message: data.message });
  });

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
