const Joi = require('joi');
const models = require('../database/models');
const { validateRequest } = require('../utils/validation');

/*
    Check if an user exists by its phone.
    If it exists, return the name
 */
async function getUser(req, res) {
  const schema = {
    params: {
      phone: Joi.string()
        .regex(
          // from https://stackoverflow.com/questions/2113908/what-regular-expression-will-match-valid-international-phone-numbers
          /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
        )
        .required(),
    },
  };

  const error = validateRequest({ params: req.params }, schema);
  if (error !== null) return res.status(400).json({ success: false, error });

  const { phone } = req.params;

  const user = await models.User.findOne({ phone });
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

module.exports = { getUser };
