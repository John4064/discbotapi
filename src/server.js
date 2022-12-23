const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config({ path: '../.env' });
const schema = require('./db/schema');
const db = require('./db/connection');
//const whitelist = db.get('Whitelist');
const app = express();
const mysql = require("mysql");

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
/* Get all whitelists */
// app.get('/', async (req, res, next) => {
//     let query = "SELECT * FROM Whitelist";
//     db.query(query,(err,sqlResult)=>{
//         if(err){
//             console.error("Error with SQL Request");
//             next(err);
//         }
//         res.json(sqlResult);
//     });
// });
//
// /*Add to Whitelist*/
//
//
//
// app.get('/health', async (req, res, next) => {
//     console.log("Health Check");
//     res.json({message: 'Server is up and running.'});
// });
//

require("./routes/routes.js")(app);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});