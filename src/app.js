const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const authenticationRouter = require('./routes/authentication');
const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/user');
const providerRouter = require('./routes/provider');

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
router.use('/authentication', authenticationRouter);
router.use('/categories', categoriesRouter);
router.use('/user', userRouter);
router.use('/provider', providerRouter);

app.use('/api', router);

module.exports = app;
