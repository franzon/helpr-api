const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: String,
  name: String,
});

module.exports = mongoose.model('User', schema);
