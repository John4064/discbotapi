const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config({ path: '../.env' });

const schema = require('./db/schema');
console.log("WORKS")
const db = require('./db/connection');
console.log("DB WORKS")
const employees = db.get('Whitelist');


const app = express();
const monk = require('monk');

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
