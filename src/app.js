const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectTimeout = require('connect-timeout');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const authenticationRouter = require('./routes/authentication');
const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/user');
const providerRouter = require('./routes/provider');

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(connectTimeout('3s'));
app.use(helmet());
app.use(compression());
app.use(morgan('tiny'));

const router = express.Router();
router.use('/authentication', authenticationRouter);
router.use('/categories', categoriesRouter);
router.use('/user', userRouter);
router.use('/provider', providerRouter);

app.use('/api', router);

module.exports = app;
