const controller = require("../controllers/v1controller");
module.exports = (app) =>{
    const controller = require("../controllers/v1controller");

    var router = require("express").Router();

    router.get("/", controller.getAll);

    router.get("/findbyid/:id", controller.findById);

    router.get("/findbysteam/:identifier", controller.findBySteam);
    // Update a Tutorial with id
    router.put("/update/:id", controller.updateById);
    // Create a new Tutorial
    router.post("/create", controller.create);

    router.delete("/kill/:id", controller.delete);

    app.use('/api', router);
}