const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config({ path: '../.env' });
const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

require("./routes/routes.js")(app);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});