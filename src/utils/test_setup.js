const mongoose = require('mongoose');

jest.setTimeout(30000);

global.beforeAll(async () => {
  await mongoose.connect(process.env.TESTING_DB_HOST, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
  });
});

global.afterAll(async () => {
  await mongoose.disconnect();
});

// Drop database before/after each test for isolation

global.beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

global.afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});
