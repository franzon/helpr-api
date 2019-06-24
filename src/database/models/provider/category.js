const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

module.exports = mongoose.model('Category', schema);
