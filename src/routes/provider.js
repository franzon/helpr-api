const providerRouter = require('express').Router();
const providerController = require('../domains/provider/provider');
// const authMiddleware = require('../middlewares/auth.js');

// providerRouter.use(authMiddleware);

providerRouter.post('/', providerController.addProvider);
// providerRouter.post('/category', providerController.addCategory);
providerRouter.delete('/:email', providerController.deleteProvider);
providerRouter.get('/findProvider/:email', providerController.findProvider);
providerRouter.get('/category', providerController.getProvidersByCategory);

module.exports = providerRouter;
