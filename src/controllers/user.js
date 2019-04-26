const Joi = require('joi');
const models = require('../database/models');
const bcrypt = require('bcrypt');
const { validateRequest } = require('../utils/validation');

async function createUser(req, res) {
  const { name, email, password, phone } = req.body;
  /*
  const schema = {
    params: {
      email: Joi.string()
      .regex(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      )
      .required(),// Falta parametros.
    },
  };
  */
  var newUser = new models.User({
    name,
    email,
    phone,
    password: await bcrypt.hash(password, 10),
  });

  /*
      Validation fields required.
   */

  try {
    await newUser.save();

    return res.json({
      success: true,
      data: {
        name,
        email,
        phone
      }
    });
  } catch(err) {
    if(err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ success: false, error: 'User already exists.' });
    }

    return res.status(500).json({ success: false, error: err });
  }

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
module.exports = {
  createUser,/*
  getUser,
  getUserById,
  updateUser,
  deleteUser,*/
};