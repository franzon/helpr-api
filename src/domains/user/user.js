const Joi = require('joi');
const models = require('../../database/models');
const { sendEmail } = require('../../utils/email');
const { validateRequest, regexes } = require('../../utils/validation');

async function getUserAddresses(req, res) {
  try {
    const { email } = req.user;

    const user = await models.User.findOne({ email }).populate('addresses');
    res.json({ message: 'user addresses', data: { addresses: user.addresses } });
  } catch (error) {
    res.status(200).send({ message: 'error', data: null });
  }
}

async function addUserAddress(req, res) {
  try {
    const schema = {
      body: {
        state: Joi.string().required(),
        city: Joi.string().required(),
        neighborhood: Joi.string().required(),
        street: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.optional(),
      },
    };

    const error = validateRequest({ body: req.body }, schema);
    if (error !== null) return res.status(400).json({ message: error, data: null });

    const { email } = req.user;
    let user = await models.User.findOne({ email });

    const {
      state, city, neighborhood, street, number, complement,
    } = req.body;

    const newAddress = await new models.Address({
      state,
      city,
      neighborhood,
      street,
      number,
      complement,
    }).save();
    user.addresses.push(newAddress);

    user = await user.save();
    user = await models.User.findOne({ email }).populate('addresses');
    return res.json({ message: 'address added', data: { addresses: user.addresses } });
  } catch (error) {
    return res.status(200).send({ message: 'error', data: null });
  }
}

/*
    GET /getUserInfo

    Get user info by token
 */
async function getUserInfo(req, res) {
  const user = await models.User.findOne({ email: req.user.email }).populate('addresses');

  res.json({ message: 'user info', data: user });
}

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
    body: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
      name: Joi.string()
        // .regex(regexes.name)
        .required(),
      password: Joi.string()
        .regex(regexes.password)
        .required(),
    },
  };

  const error = validateRequest(
    {
      body: req.body,
    },
    schema,
  );

  const { name, email, password } = req.body;

  if (error) return res.status(400).json({ message: error, data: null });

  const user = await models.User.findOne({ email });
  if (user) return res.status(400).json({ message: 'user already exists', data: null });

  await models.User.create({
    name,
    email,
    password,
  });

  // Makes more sense to send validation code here instead of user asking it...
  const subject = 'Confirmation Code';

  let confirmationCode = '';
  for (let i = 0; i < 6; i += 1) {
    confirmationCode += Math.floor(Math.random() * 10 + 1).toString();
  }

  const text = `
    This is your confirmation code: 
    
          ${confirmationCode}
    
    `;

  sendEmail(email, subject, text);

  const emailModel = new models.EmailConfirmation({ email, confirmationCode });
  await emailModel.save();

  // /* istanbul ignore next */
  // if (!newUser) {
  //   return res.status(500).json({ success: false, error: 'erro de conexao com' });
  // }

  return res.json({
    message: 'user created',
    data: {
      name,
      email,
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

module.exports = {
  getUserInfo,
  getUserNameByEmail,
  createUser,
  getUserAddresses,
  addUserAddress,
};
