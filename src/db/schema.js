const Joi = require('joi');

const schema = Joi.object({
    identifier: Joi.string()
        .min(3)
        .max(100)
        .required(),
    weight: Joi.number()
        .integer()
        .min(0)
        .max(99999999),
    serverName: Joi.string()
        .min(3)
        .max(255)
        .required(),

})

module.exports = schema;
