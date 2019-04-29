const Joi = require('joi');
const bcrypt = require('bcrypt');
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

async function createUser(req, res) {
  const schema = {
    params: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
      name: Joi.string()
        .regex(regexes.name)
        .required(),
      phone: Joi.string()
        .regex(regexes.phone)
        .required(),
      password: Joi.string()
        .regex(regexes.password)
        .required(),
    },
  };

  const {
    name,
    email,
    password,
    phone,
  } = req.body;

  const error = validateRequest(
    {
      params: {
        email,
        name,
        phone,
        password,
      },
    },
    schema,
  );

  if (error) return res.status(400).json({ message: error, data: null });

  const newUser = new models.User({
    name,
    email,
    phone,
    password: await bcrypt.hash(password, 10),
  });

  try {
    await newUser.save();

    return res.json({
      success: true,
      data: {
        name,
        email,
        phone,
      },
    });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ success: false, error: 'User already exists.' });
    }

    return res.status(500).json({ success: false, error: err });
  }
}

module.exports = { getUserNameByEmail, createUser };
