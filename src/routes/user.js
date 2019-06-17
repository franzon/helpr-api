const router = require('express').Router();
const userController = require('../domains/user/user');
const { checkTokenClient } = require('../middlewares/authentication');

router.get('/getUserInfo', checkTokenClient, userController.getUserInfo);
router.get('/getUserNameByEmail/:email', userController.getUserNameByEmail);
router.post('/createUser', userController.createUser);

module.exports = router;
