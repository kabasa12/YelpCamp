const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        title:Joi.string().required().min(3),
        price:Joi.number().required().min(10).max(300),
        // images:Joi.object({
        //     url:Joi.string().required().uri(),
        //     filename:Joi.string().required()
        // }),
        location:Joi.string().required().min(5),
        description:Joi.string().required().min(20)
    }).required(),
    deleteImages:Joi.array()

});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required().min(5)
    }).required()
});