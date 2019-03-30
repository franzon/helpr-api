const express = require('express');
const authController = require('./controllers/auth');

const mainRouter = express.Router();
const authRouter = express.Router();

mainRouter.use('/auth', authRouter);

authRouter.get('/get-user/:email', authController.getUser);

module.exports = mainRouter;
