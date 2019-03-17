const express = require('express');
const exampleController = require('./controllers/example');

const mainRouter = express.Router();
const exampleRouter = express.Router();

mainRouter.use('/example', exampleRouter);

/*      /example        */
exampleRouter.get('/', exampleController.get);
exampleRouter.get('/:id', exampleController.getById);
exampleRouter.post('/', exampleController.post);
exampleRouter.put('/:id', exampleController.put);
exampleRouter.delete('/:id', exampleController.remove);

module.exports = mainRouter;
