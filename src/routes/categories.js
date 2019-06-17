const categoriesRouter = require('express').Router();
const categoriesController = require('../domains/categories/categories');

categoriesRouter.get('/getCategories/', categoriesController.getCategories);
categoriesRouter.get('/getCategory/:identifier', categoriesController.getCategoryById);

categoriesRouter.post('/', categoriesController.addCategory);
// categoriesRouter.put('/:identifier');
categoriesRouter.delete('/deleteCategory/:identifier', categoriesController.deleteCategory);

module.exports = categoriesRouter;
