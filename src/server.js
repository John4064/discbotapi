const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config({ path: '../.env' });
const schema = require('./db/schema');
console.log("WORKS")
const db = require('./db/connection');
console.log("DB WORKS");
//const whitelist = db.get('Whitelist');
const app = express();
const mysql = require("mysql");

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
/* Get all whitelists */
app.get('/', async (req, res, next) => {
    console.log("RECEIVED")

    try {
        console.log("FIRST")
        //const allWhitelists = await whitelist.find({}, 'identifier').then((docs) => {});

        console.log("SECOND")
        res.json("a");
    } catch(error) {
        next(error);
    }
});

app.get('/health', async (req, res, next) => {
    console.log("Health Check");
    res.json({message: 'Server is up and running.'});
});



const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});