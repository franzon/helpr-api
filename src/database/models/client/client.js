const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  password: String,
  credits: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  addresses: [
    {
      type: 'ObjectId',
      ref: 'Address',
    },
  ],
  isConfirmed: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
});

schema.pre('save', async function x() {
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', schema);
