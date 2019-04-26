const Joi = require('joi');
const models = require('../../database/models');
const { validateRequest, regexes } = require('../../utils/validation');

/*
    GET /getUserNameByEmail

    Check if an user exists by its email.
    If it exists, return the name

    Used to check if user already exists
 */
async function getUserNameByEmail(req, res) {
  const schema = {
    params: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
    },
  };

  const error = validateRequest({ params: req.params }, schema);
  if (error !== null) return res.status(400).json({ message: error, data: null });

  const { email } = req.params;

  const user = await models.User.findOne({ email });
  if (!user) {
    return res.json({ message: 'user not exists', data: null });
  }

  return res.json({
    message: 'user exists',
    data: user.name,
  });
}

module.exports = { getUserNameByEmail };
