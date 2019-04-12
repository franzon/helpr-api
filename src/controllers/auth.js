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
        .regex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        )
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

/* Email confirmation */

async function sendConfirmationCode(req, res) {
  // email validation schema
  const schema = {
    body: {
      email: Joi.string()
        .regex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        )
        .required(),
    },
  };

  const error = validateRequest({ body: req.body }, schema); // validation
  if (error !== null) return res.status(400).json({ success: false, error }); // erro

  const { email } = req.body;

  const subject = 'Confirmation Code';

  let confirmationCode = '';
  for (let i = 0; i < 6; i += 1) {
    confirmationCode += Math.floor(Math.random() * 10 + 1).toString();
  }

  const text = `
  This is your confirmation code: 
  
        ${confirmationCode}
  
  `;

  const user = await models.User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'user_not_exists' });
  }
  if (user.isConfirmed) {
    return res.json({ error: 'already_confirmed' });
  }

  const emailConfirmation = await models.EmailConfirmation.findOne({ email });
  if (!emailConfirmation) {
    const emailModel = new models.EmailConfirmation({ email, confirmationCode });
    await emailModel.save();
  } else {
    emailConfirmation.confirmationCode = confirmationCode;
    await emailConfirmation.save();
  }

  // Jest...
  // eslint-disable-next-line global-require
  const { sendEmail } = require('../utils/email');
  sendEmail(email, subject, text);

  return res.status(200).json({ sucess: true, data: { sent: true } });
}

async function confirmEmail(req, res) {
  // email validation schema
  const schema = {
    body: {
      email: Joi.string()
        .regex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        )
        .required(),
      confirmationCode: Joi.string().required(),
    },
  };

  const error = validateRequest({ body: req.body }, schema); // validation
  if (error !== null) return res.status(400).json({ success: false, error }); // erro

  const { email, confirmationCode } = req.body;

  const user = await models.User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'user_not_exists' });
  }
  if (user.isConfirmed) {
    return res.json({ error: 'already_confirmed' });
  }

  const emailConfirmation = await models.EmailConfirmation.findOne({
    email,
    confirmationCode,
  });

  if (!emailConfirmation) {
    return res.status(404).json({ sucess: false, msg: 'invalid_code' });
  }

  user.isConfirmed = true;
  await user.save();

  await models.EmailConfirmation.deleteOne({ email });
  return res.status(200).json({
    sucess: true,
    data: {
      email,
    },
  });
}

module.exports = { getUser, sendConfirmationCode, confirmEmail };
