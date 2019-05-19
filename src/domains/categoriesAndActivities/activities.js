/* eslint-disable no-underscore-dangle */
const models = require('../../database/models');

async function updateActivity(req, res) {
  const { id: _id } = req.params;
  const { title, description, price } = req.body;

  const activity = await models.ActivitiesProvider.findOneAndUpdate(
    { _id },
    { title, description, price },
  );

  return res.status(200).send({
    message: 'success',
    data: activity,
  });
}

async function deleteActivity(req, res) {
  const { id: _id } = req.params;

  const activity = await models.ActivitiesProvider.findOne({ _id });

  const providerId = activity.provider;
  const categoryId = activity.assignedTo;

  const provider = await models.Provider.findOne({ _id: providerId });
  const category = await models.CategoriesProvider.findOne({ _id: categoryId });

  const activityRes = await models.ActivitiesProvider.findOneAndDelete({ _id });

  if (provider !== null) {
    provider.activities.splice(provider.activities.indexOf(_id), 1);
    await provider.save();
  }

  if (category !== null) {
    category.activities.splice(category.activities.indexOf(_id), 1);
    await category.save();
  }

  return res.status(200).send({
    message: 'success',
    data: activityRes,
  });
}

module.exports = {
  updateActivity,
  deleteActivity,
};
