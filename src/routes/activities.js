const activitiesRouter = require('express').Router();
const activitiesController = require('../domains/categoriesAndActivities/activities');

activitiesRouter.delete('/:id', activitiesController.deleteActivity);
activitiesRouter.put('/:id', activitiesController.updateActivity);

module.exports = activitiesRouter;
