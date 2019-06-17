// const Joi = require('joi');
const models = require('../../database/models');
// const { validateRequest } = require('../../utils/validation');

async function addCategory(req, res) {
  const { identifier, title, activities } = req.body;

  const category = await models.CategoriesProvider.find({ identifier });
  if (category !== undefined && category.length !== 0) {
    return res.status(400).send({
      message: 'category already created',
      data: null,
    });
  }

  const categoryCreated = await models.CategoriesProvider.create({ identifier, title });

  // await Promise.all(activities.map(async (activity) => {
  //   const categoryActivity = new models.ActivitiesProvider({
  //     ...activity,
  //     category: categoryCreated.id,
  //   });
  //   await categoryActivity.save();
  //   categoryCreated.activities.push(categoryActivity);
  // }));
  // await categoryCreated.save();
  return res.status(200).send({ message: 'category created', data: categoryCreated });
}

async function getCategories(req, res) {
  const categories = await models.CategoriesProvider.find();

  return res.status(200).send({
    message: 'success',
    data: categories,
  });
}

async function getCategoriesAndActivities(req, res) {
  const categories = await models.CategoriesProvider.find().populate('ActivitiesProvider');

  return res.status(200).send({
    message: 'success',
    data: categories,
  });
}

async function getCategoryById(req, res) {
  const { identifier } = req.params;
  const category = await models.CategoriesProvider.findOne({ identifier });

  if (category === null) {
    return res.status(400).send({
      message: 'category not found',
      data: null,
    });
  }

  return res.status(200).send({
    message: 'success',
    data: category,
  });
}

async function deleteCategory(req, res) {
  const { identifier } = req.params;
  const category = await models.CategoriesProvider.findOne({ identifier });

  if (category === null) {
    return res.status(400).send({
      message: 'category not found',
      data: null,
    });
  }
  const deletedCategory = await models.CategoriesProvider.findOneAndDelete({ identifier });
  return res.status(200).send({
    message: 'success',
    data: deletedCategory,
  });
}

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  getCategoriesAndActivities,
  deleteCategory,
};
