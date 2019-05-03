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

  if (error) return res.status(400).json({ success: false, message: error, data: null });

  const user = await models.User.find({ email });
  if (user !== undefined && user.length) return res.status(400).json({ success: false, error: 'User already exists.' });

  const newUser = await models.User.create({
    name,
    email,
    phone,
    password: await bcrypt.hash(password, 10),
  });

  /* istanbul ignore next */
  if (!newUser) {
    return res.status(500).json({ success: false, error: 'erro de conexao com' });
  }

  return res.json({
    success: true,
    data: {
      name,
      email,
      phone,
    },
  });
}

/*
async function getUser(req, res) {
  const { email } = req.body;

  const user = await models.User.findOne({ email });

  if(!user) {
    return res.json({ success: true, data: null });
  }

  return res.json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}

async function getUserById(req, res) {
  const { id } = req.params;

  const user = await models.User.findOne({ _id: id });

  if(!user) {
    return res.json({ success: true, data: null });
  }

  return res.json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}

async function updateUser(req, res) {
  const { id, name, email, phone, password } = req.body;

  try {
    const user = await models.User.findOneAndUpdate({ _id: id }, {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(password !== undefined ? {
          password: await bcrypt.hash(password, 10),
        } : {}),
    });

    if(!user) {
      return res.status(400).json({ success: false, data: null });
    }

    return res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    })
  } catch(error) {
    return res.status(400).json({
      success: false, data: null,
      message: 'erro ao atualizar o usuario',
    });
  }
}

async function deleteUser(req, res) {
  const  { id } = req.body;

  try {
    const user = await models.User.deleteOne({ _id: id });

    if(!user) {
      return res.json({ success: true, data: null });
    }

    return res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })

  } catch(error) {
    return res.status(400).json({ success: false, data: null });
  }
}
*/

module.exports = { getUserNameByEmail, createUser };
