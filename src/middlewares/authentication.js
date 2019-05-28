const jwt = require('jsonwebtoken');
const models = require('../database/models');
const keys = require('../utils/keys.json');

async function checkTokenClient(req, res, next) {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).send({
      message: 'invalid token',
      data: null,
    });
  }

  try {
    const email = await jwt.verify(token, keys.jwt);
    const user = await models.User.findOne({ email }).select('-password -__v');

    if (!user) {
      return res.status(401).send({
        message: 'invalid token',
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({
      message: 'invalid token',
      data: null,
    });
  }
}

module.exports = { checkTokenClient };
