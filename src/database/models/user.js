const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  password: String,
  credits: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  isConfirmed: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', schema);
