const controller = require("../controllers/v1controller");
module.exports = (app) =>{
    const controller = require("../controllers/v1controller");

    var router = require("express").Router();

    router.get("/", controller.getAll);

    router.get("/findbyid/:id", controller.findById);

    router.get("/findbysteam/:identifier", controller.findBySteam);
    // Update a Tutorial with id
    router.put("/:id", controller.update);
    app.use('/api', router);
}