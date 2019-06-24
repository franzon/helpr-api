const mongoose = require('mongoose');
const Address = require('./address');

module.exports = Address.discriminator(
  'LocationAddress',
  mongoose.Schema({
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
  }),
);
