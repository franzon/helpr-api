const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  phoneNumber: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePictureUrl: {
    type: String,
    default: 'https://randomuser.me/api/portraits/men/61.jpg',
  },
  serviceDescription: {
    type: String,
    default: 'lorem ipsum',
  },
  minServicePrice: {
    type: Number,
    default: 0,
  },
  maxServicePrice: {
    type: Number,
    default: Infinity,
  },
});

schema.pre('save', async function hook() {
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Provider', schema);
