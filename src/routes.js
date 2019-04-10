const express = require('express');
const authController = require('./controllers/auth');

const mainRouter = express.Router();
const authRouter = express.Router();

mainRouter.use('/auth', authRouter);

authRouter.get('/get-user/:email', authController.getUser);

authRouter.post('/email-confirmation/send-code', authController.sendConfirmationCode);
authRouter.post('/email-confirmation/verify', authController.confirmEmail);

module.exports = mainRouter;
