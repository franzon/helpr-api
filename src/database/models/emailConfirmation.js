const mongoose = require('mongoose');

const emailConfirmationSchema = mongoose.Schema({
  email: String,
  confirmationCode: String,
  createdAt: { type: Date, expires: 3600 * 12 },
});

module.exports = mongoose.model('EmailConfirmation', emailConfirmationSchema);
