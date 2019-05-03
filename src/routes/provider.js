const providerRouter = require('express').Router();
const providerController = require('../domains/provider/provider');

providerRouter.post('/', providerController.addProvider);
providerRouter.delete('/:email', providerController.deleteProvider);
providerRouter.get('/getProvider/:email', providerController.findProvider);

module.exports = providerRouter;
