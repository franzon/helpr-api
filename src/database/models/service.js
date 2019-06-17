const mongoose = require('mongoose');

const enumered = [
  0, // Cancelado
  1, // Criado
  2, // Aceito
  3, // Recusado
];

const schema = mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivitiesProvider',
  },
  description: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    enum: enumered,
    default: 1,
  },
});

module.exports = mongoose.model('Service', schema);
