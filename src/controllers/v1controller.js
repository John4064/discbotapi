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
    // console.log(req.body);
    // let test = new Whitelist(req.body);
    // test.id=req.params.id;
    // console.log(test);
    Whitelist.updateById(
        req.params.id,
        new Whitelist(req.body),
        (err, data) => {
            let t = new Whitelist(req.body);
            console.log(data);

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