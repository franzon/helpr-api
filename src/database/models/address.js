const mongoose = require('mongoose');

const schema = mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  complement: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Address', schema);
