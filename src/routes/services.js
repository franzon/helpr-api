const servicesRouter = require('express').Router();
const servicesController = require('../domains/services/services');

servicesRouter.post('/', servicesController.addService);
servicesRouter.post('/deny', servicesController.denyService);
servicesRouter.post('/cancel', servicesController.cancelService);
servicesRouter.post('/accept', servicesController.acceptService);

module.exports = servicesRouter;
