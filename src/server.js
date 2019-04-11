require('./database/database');
const app = require('./app');

// const host = process.env.USE_DOCKER === 'true' ? process.env.HOST : '0.0.0.0';
// const port = process.env.USE_DOCKER === 'true' ? process.env.PORT : 3000;

// Fixing heroku error
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at ${host}:${port}`);
});
