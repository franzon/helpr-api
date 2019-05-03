const bcrypt = require('bcrypt');
const Joi = require('joi');
const models = require('../../database/models');
const { validateRequest } = require('../../utils/validation');

async function addProvider(req, res) {
  const {
    email,
    name,
    password,
    cep,
    numberAddress,
    phoneNumber,
    category,
    serviceDescription,
    servicePrice,
    cpf,
  } = req.body;

  const provider = await models.Provider.findOne({ email });

  if (provider != null) {
    return res.status(400).send({
      message: 'email already used',
      data: null,
    });
  }

  const schema = {
    body: {
      email: Joi.string()
        .regex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        )
        .required(),
      name: Joi.string()
        .required(),
      password: Joi.string()
        .regex(
          /^[a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]{6,100}$/,
        )
        .required(),
      cep: Joi.string()
        .regex(
          /^[0-9]{5}-[\d]{3}$/,
        )
        .required(),
      numberAddress: Joi.string()
        .required(),
      phoneNumber: Joi.string()
        .regex(
          /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
        )
        .required(),
      category: Joi.string()
        .required(),
      serviceDescription: Joi.string()
        .required(),
      servicePrice: Joi.string()
        .required(),
      cpf: Joi.string()
        .regex(
          /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/,
        )
        .required(),
    },
  };

  const error = validateRequest(
    {
      body: {
        email,
        name,
        password,
        cep,
        numberAddress,
        phoneNumber,
        category,
        serviceDescription,
        servicePrice,
        cpf,
      },
    }, schema,
  );

  if (error !== null) return res.status(400).send({ message: 'fail validation', data: null });

  const hashPassword = await bcrypt.hash(password, 10);

  const resProvider = await models.Provider.create({
    email,
    name,
    password: hashPassword,
    cep,
    numberAddress,
    phoneNumber,
    category,
    serviceDescription,
    servicePrice,
    cpf,
  });

  return res.status(200).send({
    message: 'success',
    data: resProvider,
  });
}

const findProvider = async (req, res) => {
  const { email } = req.params;
  const provider = models.Provider.find({ email });

  if (provider === null) {
    return res.status(400).send({
      message: 'user not found',
      data: null,
    });
  }

  return res.status(200).send({
    message: 'success',
    data: provider,
  });
};

const deleteProvider = async (req, res) => {
  const { email } = req.params;

  const provider = await models.Provider.findOneAndDelete({ email }, (err) => {
    if (err) {
      return res.status(400).send({
        message: 'user not exists',
        data: null,
      });
    }
    return res.status(200).send({
      message: 'success',
      data: provider,
    });
  });
};

module.exports = {
  addProvider,
  deleteProvider,
  findProvider,
};
