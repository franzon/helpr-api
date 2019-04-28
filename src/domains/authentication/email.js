const Joi = require('joi');
const models = require('../../database/models');
const { validateRequest, regexes } = require('../../utils/validation');

/*
    POST /sendConfirmationCode

    Send email confirmation code

    Used to check if user is a real human
 */
async function sendConfirmationCode(req, res) {
  const schema = {
    body: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
    },
  };

  const error = validateRequest({ body: req.body }, schema);
  if (error !== null) return res.status(400).json({ message: error, data: null });

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

  if (!user) return res.status(400).json({ message: 'user not exists', data: null });
  if (user.isConfirmed) return res.json({ message: 'already confirmed', data: null });

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
  const { sendEmail } = require('../../utils/email');
  sendEmail(email, subject, text);

  return res.json({ message: 'email sent', data: null });
}

/*
    POST /confirmEmail

    Confirm email

    Used to check if user is a real human
 */
async function confirmEmail(req, res) {
  // email validation schema
  const schema = {
    body: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
      confirmationCode: Joi.string().required(),
    },
  };

  const error = validateRequest({ body: req.body }, schema);
  if (error !== null) return res.status(400).json({ message: error, data: null });

  const { email, confirmationCode } = req.body;

  const user = await models.User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'user not exists', data: null });
  }
  if (user.isConfirmed) {
    return res.json({ message: 'already confirmed', data: null });
  }

  const emailConfirmation = await models.EmailConfirmation.findOne({
    email,
    confirmationCode,
  });

  if (!emailConfirmation) {
    return res.status(400).json({ message: 'invalid code', data: null });
  }

  user.isConfirmed = true;
  await user.save();

  await models.EmailConfirmation.deleteOne({ email });
  return res.status(200).json({
    message: 'email confirmed',
    data: null,
  });
}

module.exports = { sendConfirmationCode, confirmEmail };
