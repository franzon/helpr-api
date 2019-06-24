const mongoose = require('mongoose');

const schema = mongoose.Schema({}, { discriminatorKey: 'type' });
module.exports = mongoose.model('Address', schema);
