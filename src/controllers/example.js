const Joi = require('joi');
const { validateRequest } = require('../utils/validation');

function get(req, res) {
  return res.json({ success: true, message: 'Hello World on Heroku!' });
}

function getById(req, res) {
  const schema = {
    params: {
      id: Joi.number().required(),
    },
  };

  const error = validateRequest({ params: req.params }, schema);
  if (error !== null) return res.json(error);

  return res.json({ success: true, foo: 'Hello World guys!' });
}

function post(req, res) {
  const schema = {
    body: {
      name: Joi.string().required(),
    },
  };

  const error = validateRequest({ body: req.body }, schema);
  if (error !== null) return res.json(error);

  const { name } = req.body;

  return res.json({ success: true, foo: `Hello ${name}!` });
}

function put(req, res) {
  const schema = {
    body: {
      name: Joi.string().required(),
    },

    params: {
      id: Joi.number().required(),
    },
  };

  const error = validateRequest({ body: req.body, params: req.params }, schema);
  if (error !== null) return res.json(error);

  const { name } = req.body;

  return res.json({ success: true, foo: `Hello ${name}!` });
}

// delete is a reserved keyword
function remove(req, res) {
  const schema = {
    params: {
      id: Joi.number().required(),
    },
  };

  const error = validateRequest({ params: req.params }, schema);
  if (error !== null) return res.json(error);

  return res.json({ success: true, foo: 'Hello World!' });
}

module.exports = {
  get,
  getById,
  post,
  put,
  remove,
};
