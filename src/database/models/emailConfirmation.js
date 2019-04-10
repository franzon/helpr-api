const mongoose = require('mongoose');

const emailConfirmation = mongoose.Schema({
  email: String,
  confirmationCode: String,
  createdAt: { type: Date, expires: 3600 * 12 },
});

module.exports = mongoose.model('EmailConfirmation', emailConfirmation);
