const mongoose = require('mongoose');
const Address = require('./address');

module.exports = Address.discriminator(
  'NormalAddress',
  mongoose.Schema({
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
  }),
);
