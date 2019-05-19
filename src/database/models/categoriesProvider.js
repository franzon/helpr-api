const mongoose = require('mongoose');

const schema = mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivitiesProvider',
  }],
  createdAt: {
    type: Date,
    deafult: Date.now,
  },
});

module.exports = mongoose.model('CategoriesProvider', schema);
