const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

module.exports = mongoose;
