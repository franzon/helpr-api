const router = require('express').Router();
const userController = require('../domains/user/user');

router.get('/getUserNameByEmail/:email', userController.getUserNameByEmail);

module.exports = router;
