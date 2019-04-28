const Joi = require('joi');

const validateRequest = (object, schema) => {
  const { error } = Joi.validate(object, schema);
  if (error !== null) return { message: error.details };
  return null;
};

const regexes = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
};

module.exports = { validateRequest, regexes };
