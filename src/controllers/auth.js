const Joi = require('joi');
const models = require('../database/models');
const { validateRequest } = require('../utils/validation');

/*
    Check if an user exists by its email.
    If it exists, return the name
 */
async function getUser(req, res) {
  const schema = {
    params: {
      email: Joi.string()
        .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
        .required(),
    },
  };

  const error = validateRequest({ params: req.params }, schema);
  if (error !== null) return res.status(400).json({ success: false, error });

  const { email } = req.params;

  const user = await models.User.findOne({ email });
  if (!user) {
    return res.json({ success: true, data: null });
  }

  return res.json({
    success: true,
    data: {
      name: user.name,
    },
  });
}

module.exports = { getUser };
