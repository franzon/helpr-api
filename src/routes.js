const express = require('express');
const authController = require('./controllers/auth');
const loginController = require('./controllers/login');

const mainRouter = express.Router();
const authRouter = express.Router();
const loginRouter = express.Router();

loginRouter.post('/', loginController.login);
authRouter.get('/get-user/:email', authController.getUser);

mainRouter.use('/auth', authRouter);

mainRouter.use('/login', loginRouter);


module.exports = mainRouter;
