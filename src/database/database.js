const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

module.exports = mongoose;
