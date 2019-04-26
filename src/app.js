const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const authenticationRouter = require('./routes/authentication');
const categoriesRouter = require('./routes/categories');

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
router.use('/authentication', authenticationRouter);
router.use('/categories', categoriesRouter);

app.use('/api', router);

module.exports = app;
