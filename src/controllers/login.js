const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const models = require('../database/models');
const { validateRequest } = require('../utils/validation');
const keys = require('../config/keys.json');

async function login(req, res) {
  const { email, password } = req.body;

  const schema = {
    params: {
      email: Joi.string()
        .regex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        )
        .required(),
    },
  };

  const error = validateRequest({ params: { email } }, schema);
  if (error !== null) return res.status(400).json({ success: false, error });

  const user = await models.User.findOne({ where: { email } });

  if (user !== null) {
    if (await bcrypt.compareSync(password, user.password)) {
      return res.status(200).json({ sucess: true, token: jwt.token(user.email, keys) });
    }
    return res.status(400).json({ sucess: false, msg: 'invalid password' });
  }

  return res.status(400).json({ sucess: false, msg: 'invalid email' });
}

module.exports = { login };
