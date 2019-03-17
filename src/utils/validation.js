const Joi = require('joi');

const validateRequest = (object, schema) => {
  const { error } = Joi.validate(object, schema);
  if (error !== null) return { success: false, message: error.details };
  return null;
};

module.exports = { validateRequest };
