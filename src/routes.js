const express = require('express');
const authController = require('./controllers/auth');
const emailConfirmation = require('./controllers/emailConfirmation');

const mainRouter = express.Router();
const authRouter = express.Router();
const confirmationRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/confirmation', confirmationRouter); // email confirmation router

authRouter.get('/get-user/:email', authController.getUser);

confirmationRouter.get('/', emailConfirmation.confirmEmail); // body {email, confirmationCode}
confirmationRouter.post('/:email', emailConfirmation.sendConfirmationCode); // params {email}

module.exports = mainRouter;
