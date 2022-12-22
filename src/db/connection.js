const mysql = require("mysql");

let dbUrl = process.env.DB_URL;

if (process.env.NODE_ENV === 'test') {
    dbUrl = process.env.TEST_DB_URL;
}

//dburl & port is undefined for some reason


const connection = mysql.createConnection({
    host: dbUrl,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});
console.log("test1")

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});
console.log("test2")
module.exports = connection;
