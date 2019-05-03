const Joi = require('joi');

const validateRequest = (object, schema) => {
  const { error } = Joi.validate(object, schema);
  if (error !== null) return { message: error.details };
  return null;
};

const regexes = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  name: /^[a-zA-Z]{4,}$/,
  phone: /(\([0-9]{2}\)|[0-9]{2})\s[0-9]{1}(\s)?[0-9]{4}(\s|-)[0-9]{4}/,
  password: /^[a-zA-Z0-9@]{8,}$/,
};

module.exports = { validateRequest, regexes };
