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

Whitelist.updateById= (req, res)=>{
    //db query here
    sql.query(
        "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
        [tutorial.title, tutorial.description, tutorial.published, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Tutorial with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated whitelist: ", { id: id, ...Whitelist });
            result(null, { id: id, ...Whitelist });
        }
    );
};
module.exports = Whitelist;