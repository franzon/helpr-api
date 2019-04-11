require('./database/database');
const app = require('./app');

const host = process.env.USE_DOCKER === 'true' ? process.env.HOST : '127.0.0.1';
const port = process.env.USE_DOCKER === 'true' ? process.env.PORT : 3000;

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at ${host}:${port}`);
});
