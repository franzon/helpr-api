const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: String,
  name: String,
  isConfirmed: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', schema);
