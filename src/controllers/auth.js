const Joi = require('joi');
const models = require('../database/models');
const { validateRequest } = require('../utils/validation');
const { sendEmail } = require('../utils/email');

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
    params: {
      email: Joi.string()
        .regex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        )
        .required(),
    },
  };

  const error = validateRequest({ params: { email: req.body.email } }, schema); // validation
  if (error !== null) return res.status(400).json({ success: false, error }); // erro

  const subject = 'Confirmation Code';

  let confirmationCode = '';
  for (let i = 0; i < 6; i += 1) {
    confirmationCode += Math.floor(Math.random() * 10 + 1).toString();
  }

  const text = `
  This is your confirmation code: 
  
        ${confirmationCode}
  
  `;

  const email = await models.Email.findOne({ email: req.body.email });
  if (!email) {
    const emailModel = new models.Email({ email, confirmationCode });
    await emailModel.save();
  } else {
    email.confirmationCode = confirmationCode;
    await email.save();
  }

  sendEmail(req.body.email, subject, text);
  return res.status(200).json({ sucess: true, data: { email: req.body.email } });
}

async function confirmEmail(req, res) {
  // email validation schema
  const schema = {
    params: {
      email: Joi.string()
        .regex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        )
        .required(),
    },
  };

  const error = validateRequest({ params: { email: req.body.email } }, schema); // validation
  if (error !== null) return res.status(400).json({ success: false, error }); // erro

  const email = await models.Email.findOne({
    confirmationCode: req.body.confirmationCode,
  });

  if (!email) {
    return res.status(404).json({ sucess: false, msg: 'invalid code' });
  }

  await models.Email.deleteOne({ email: req.body.email });
  return res.status(200).json({
    sucess: true,
    data: {
      email: req.body.email,
    },
  });
}

module.exports = { getUser, sendConfirmationCode, confirmEmail };
