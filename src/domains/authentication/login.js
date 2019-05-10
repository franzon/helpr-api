const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const models = require('../../database/models');
const { validateRequest, regexes } = require('../../utils/validation');
const keys = require('../../utils/keys.json');

async function login(req, res) {
  const schema = {
    body: {
      email: joi
        .string()
        .regex(regexes.email)
        .required(),
      password: joi
        .string()
        .regex(regexes.password)
        .required(),
    },
  };

  const error = validateRequest({ body: req.body }, schema);
  if (error !== null) {
    return res.status(400).json({ message: 'validation fail', data: null });
  }

  const { email, password } = req.body;

  const user = await models.User.findOne({ email });
  const provider = await models.Provider.findOne({ email });

  let personEmail;
  let personPassword;
  let personName;

  if (user !== null) {
    personEmail = user.email;
    personPassword = user.password;
    personName = user.name;
  } else if (provider !== null) {
    personEmail = provider.email;
    personPassword = provider.password;
    personName = provider.name;
  }

  if (user !== null || provider !== null) {
    if (await bcrypt.compareSync(password, personPassword)) {
      const token = await jwt.sign(personEmail, keys.jwt);
      return res.status(200).json({
        message: 'sucess',
        data: {
          name: personName,
          token,
        },
      });
    }
    return res.status(400).json({ message: 'invalid password', data: null });
  }

  return res.status(400).json({ message: 'user/provider doesnt exist', data: null });
}

module.exports = { login };
