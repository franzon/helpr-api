const express = require('express');
const authController = require('./controllers/auth');
const userController = require('./controllers/user');

const mainRouter = express.Router();
const authRouter = express.Router();
const userRouter = express.Router();

mainRouter.use('/auth', authRouter);

authRouter.get('/get-user/:email', authController.getUser);

authRouter.post('/email-confirmation/send-code', authController.sendConfirmationCode);
authRouter.post('/email-confirmation/verify', authController.confirmEmail);

mainRouter.use('/user', userRouter);

userRouter.post('/add', userController.createUser);

module.exports = mainRouter;
