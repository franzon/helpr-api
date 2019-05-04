const router = require('express').Router();

const emailController = require('../domains/authentication/email');
const loginController = require('../domains/authentication/login');

router.post('/email/sendConfirmationCode', emailController.sendConfirmationCode);
router.post('/email/confirmEmail', emailController.confirmEmail);
router.post('/login', loginController.login);

module.exports = router;
