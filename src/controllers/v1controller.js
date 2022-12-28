const Whitelist = require("../db/Whitelist.js");


//Routes get the first connection and reference the controller which reference the Whitelist class that has methods
exports.getAll = (req, res) => {
    const param = null;

    Whitelist.getAll(param, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data."
            });
        else res.send(data);
    });
};

exports.findById = (req, res) =>{
    Whitelist.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Tutorial with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.findBySteam = (req, res) =>{
    Whitelist.findBySteam(req.params.identifier, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.identifier}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Tutorial with id " + req.params.identifier
                });
            }
        } else res.send(data);
    });
};

//UPDATE
exports.updateById = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    Whitelist.updateById(
        req.params.id,
        new Whitelist(req.body),
        (err, data) => {
            //console.log(data);
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Whitelist with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Whitelist with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

exports.updateBySteamId=(req,res)=>{
    Whitelist.updateBySteamId(req.params.steamid,req.body.serverName, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Tutorial with id " + req.params.id
                });
            }
        } else res.send(data);
    });
}

exports.create = (req,res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Tutorial
    const whitelist = new Whitelist({
        identifier: req.body.identifier,
        user: req.body.user || "UNK",
        serverName: req.body.serverName
    });
// Save Tutorial in the database
    Whitelist.create(whitelist, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial."});
        else res.send(data);
    });

};

exports.delete = (req, res) => {
    Whitelist.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Whitelist with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Whitelist with id " + req.params.id
                });
            }
        } else res.send({ message: `Whitelist was deleted successfully!` });
    });
};