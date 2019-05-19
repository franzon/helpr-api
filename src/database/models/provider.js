const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  numberAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoriesProvider',
  }],
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivitiesProvider',
  }],
  cpf: {
    type: String,
    required: true,
  },
  documentImageAddress: {
    type: String,
    required: false,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Provider', schema);
