const mongoose = require('mongoose');

const email = mongoose.Schema({
  email: String,
  confirmationCode: String,
});

module.exports = mongoose.model('Email', email);
