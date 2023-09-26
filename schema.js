const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        title:Joi.string().required().min(3),
        price:Joi.number().required().min(10).max(300),
        image:Joi.string().required().uri(),
        location:Joi.string().required().min(5),
        description:Joi.string().required().min(20)
    }).required()
});