const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
jest.setTimeout(30000);

// Creates in-memory mongodb server for testing

global.beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, { useNewUrlParser: true });
});

global.afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Drop database before/after each test for isolation

global.beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

global.afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});
