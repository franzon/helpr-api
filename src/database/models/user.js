const mongoose = require('mongoose');

const schema = mongoose.Schema({
  phone: String,
  name: String,
});

module.exports = mongoose.model('User', schema);
