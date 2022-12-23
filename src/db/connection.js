const mysql = require("mysql");

let dbUrl = process.env.DB_URL;

if (process.env.NODE_ENV === 'test') {
    dbUrl = process.env.TEST_DB_URL;
}

//dburl & port is undefined for some reason

const connection = mysql.createConnection({
    host: "10.0.1.27",
    user: "root",
    password: "Panda1234",
    database: "safapi"
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;
