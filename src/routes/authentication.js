const router = require('express').Router();

const userController = require('../domains/authentication/user');
const emailController = require('../domains/authentication/email');

router.get('/user/getUserNameByEmail/:email', userController.getUserNameByEmail);

router.post('/email/sendConfirmationCode', emailController.sendConfirmationCode);
router.post('/email/confirmEmail', emailController.confirmEmail);

module.exports = router;
