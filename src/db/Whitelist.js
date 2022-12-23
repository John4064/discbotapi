const db = require("./connection");

// constructor
const Whitelist = function(whitelist) {
    this.identifier = whitelist.identifier;//varchar 191
    this.user = whitelist.user;//varchar191
    this.serverName = whitelist.serverName;//int(0-9)
    this.id = whitelist.id;//int
};

Whitelist.getAll = (param, res) =>{
    let query = "SELECT * FROM Whitelist";

    //Just so I can see
    if(param){
        //Add to query this ex query += ` WHERE title LIKE '%${title}%'`;
    }
    db.query(query,(err,sqlResult)=>{
        if(err){
            console.error("Error with SQL Request");
            res(null,err);
            return;
        }
        console.log("WhiteList Get All");
        res(null,sqlResult)
    });
};

Whitelist.findById= (id, res)=>{
    db.query(`SELECT * FROM Whitelist WHERE id = "${id}"`, (err, sqlResult) => {
        if (err) {
            console.log("error: ", err);
            //res.json("Error with Request")
            res(null,err);
            return;
        }
        if (sqlResult.length) {
            console.log("Whitelisted users: ", sqlResult[0]);
            res(null,sqlResult);
            return;
        }
        res(null,null);
    });


};

Whitelist.findBySteam= (identifier, res)=>{
    db.query(`SELECT * FROM Whitelist WHERE identifier = "${identifier}"`, (err, sqlResult) => {
        if (err) {
            console.log("error: ", err);
            res(null,err);
            return;
        }
        if (sqlResult.length) {
            console.log("Whitelisted users: ", sqlResult[0]);
            res(null,sqlResult);
            return;
        }
        res(null,null);
    });


};

Whitelist.updateById= (id,newWhitelist, res)=>{
    // db query here
    //
    // console.log("THE REQ IS: "+req.params);
    db.query(
        "UPDATE Whitelist SET user = ?, serverName = ?, identifier = ? WHERE id = ?",
        [newWhitelist.user, newWhitelist.serverName, newWhitelist.identifier, id],
        (err, sqlResult) => {
            if (err) {
                console.log("error: ", err);
                res(null, err);
                return;
            }

            if (sqlResult.affectedRows == 0) {
                // not found Tutorial with the id
                res({ kind: "not_found" }, null);
                return;
            }

            console.log("updated whitelist: ", { id: id, ...newWhitelist });
            res(null, { id: id, ...newWhitelist });
            //res(null,null);
        }
    );
};
module.exports = Whitelist;