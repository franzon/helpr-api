const bcrypt = require('bcrypt');
const Joi = require('joi');
const models = require('../../database/models');
const { validateRequest, regexes } = require('../../utils/validation');

async function addProvider(req, res) {
  const {
    email,
    name,
    password,
    cep,
    address,
    neighborhood,
    numberAddress,
    phoneNumber,
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
        .regex(regexes.email)
        .required(),
      name: Joi.string().required(),
      password: Joi.string()
        .regex(regexes.password)
        .required(),
      cep: Joi.string()
        .regex(regexes.cep)
        .required(),
      address: Joi.string().required(),
      neighborhood: Joi.string().required(),
      numberAddress: Joi.string().required(),
      phoneNumber: Joi.string()
        .regex(
          /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
        )
        .required(),
      category: Joi.string().required(),
      serviceDescription: Joi.string().required(),
      servicePrice: Joi.string().required(),
      cpf: Joi.string()
        .regex(regexes.cpf)
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
        address,
        neighborhood,
        numberAddress,
        phoneNumber,
        cpf,
      },
    },
    schema,
  );

  if (error !== null) return res.status(400).send({ message: 'fail validation', data: null });

  const hashPassword = await bcrypt.hash(password, 10);

  const resProvider = await models.Provider.create({
    email,
    name,
    password: hashPassword,
    cep,
    address,
    neighborhood,
    numberAddress,
    phoneNumber,
    cpf,
  });

  return res.status(200).send({
    message: 'success',
    data: resProvider.email,
  });
}

const findProvider = async (req, res) => {
  const { email } = req.params;

  const schema = {
    params: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
    },
  };

  const error = validateRequest(
    {
      params: {
        email,
      },
    },
    schema,
  );

  if (error !== null) return res.status(400).send({ message: 'fail validation', data: null });

  const provider = await models.Provider.findOne({ email });

  if (provider === null) {
    return res.status(400).send({
      message: 'user not found',
      data: null,
    });
  }
  provider.password = undefined;

  return res.status(200).send({
    message: 'success',
    data: provider,
  });
};

const deleteProvider = async (req, res) => {
  const { email } = req.params;

  const schema = {
    params: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
    },
  };

  const error = validateRequest(
    {
      params: {
        email,
      },
    },
    schema,
  );

  if (error !== null) return res.status(400).send({ message: 'fail validation', data: null });

  const provider = await models.Provider.findOneAndDelete({ email });

  if (provider === null) {
    return res.status(400).send({
      message: 'fail',
      data: null,
    });
  }
  return res.status(200).send({
    message: 'success',
    data: null,
  });
};

const addCategory = async (req, res) => {
  const { email, activities } = req.body;

  const schema = {
    params: {
      email: Joi.string()
        .regex(regexes.email)
        .required(),
    },
  };

  const error = validateRequest(
    {
      params: {
        email,
      },
    },
    schema,
  );

  if (error !== null) return res.status(400).send({ message: 'fail validation', data: null });

  const provider = await models.Provider.findOne({ email });
  if (provider === null) return res.status(400).send({ message: 'provider not found' });

  await Promise.all(
    activities.map(async (activity) => {
      const title = activity.category;
      const category = await models.CategoriesProvider.findOne({ title });

      const categoryActivity = new models.ActivitiesProvider({
        ...activity,
        // eslint-disable-next-line no-underscore-dangle
        assignedTo: category.id,
        provider,
      });
      await categoryActivity.save();

      category.activities.push(categoryActivity);
      provider.activities.push(categoryActivity);

      // eslint-disable-next-line no-underscore-dangle
      if (!provider.categories.some(cat => category.id === cat.id)) {
        provider.categories.push(category);
      }

      await category.save();
    }),
  );
  await provider.save();
  return res.status(200).send({ message: 'success' });
};

module.exports = {
  addProvider,
  deleteProvider,
  findProvider,
  addCategory,
};
