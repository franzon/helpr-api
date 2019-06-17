const categoriesRouter = require('express').Router();
const categoriesController = require('../domains/categoriesAndActivities/categories');

categoriesRouter.get('/getCategories/', categoriesController.getCategories);
categoriesRouter.get('/getCategory/:identifier', categoriesController.getCategoryById);
categoriesRouter.get('/getCategoriesAndActivities', categoriesController.getCategoriesAndActivities);
categoriesRouter.post('/', categoriesController.addCategory);
// categoriesRouter.put('/:identifier');
categoriesRouter.delete('/deleteCategory/:identifier', categoriesController.deleteCategory);

module.exports = categoriesRouter;
