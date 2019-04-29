require('./database/database');
const app = require('./app');

const host = process.env.HOST;
const port = process.env.PORT;

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at ${host}:${port}`);
});
