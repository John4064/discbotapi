const mysql = require("mysql");

let dbUrl = process.env.DB_URL;

if (process.env.NODE_ENV === 'test') {
    dbUrl = process.env.TEST_DB_URL;
}

//dburl & port is undefined for some reason

var db_config = {
    host: "10.0.1.27",
        user: "root",
        password: "Panda1234",
        database: "safapi"
};
var connection;

function handleDisconnect(){
    connection = mysql.createConnection(db_config);

    // open the MySQL connection
    connection.connect(err => {
        if (err){
            console.log("Error when connecting to the db:",err);
            setTimeout(handleDisconnect,60000);
        }else{
            console.log("Successfully connected to the database.");
        }
        connection.on('error', function(err) {
            console.log('db error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                handleDisconnect();                         // lost due to either server restart, or a
            } else {                                      // connnection idle timeout (the wait_timeout
                throw err;                                  // server variable configures this)
            }
        })

    });
}
handleDisconnect();


module.exports = connection;
