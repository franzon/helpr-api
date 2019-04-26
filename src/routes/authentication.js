const router = require('express').Router();

const emailController = require('../domains/authentication/email');

router.post('/email/sendConfirmationCode', emailController.sendConfirmationCode);
router.post('/email/confirmEmail', emailController.confirmEmail);

module.exports = router;
