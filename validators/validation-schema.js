const Joi = require('joi');

const usernameSchema = Joi.object({
    username: Joi.string().min(5).required()
});

const userSchema = Joi.object({
    googleId: Joi.string().required(),
    displayName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    image: Joi.string().optional(),
    createdAt: Joi.date().optional()
}).options({ stripUnknown: true });

const observationSchema = Joi.object({
    title: Joi.string().required(),
    observation: Joi.string().required(),
    object_type: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().optional(),
    location: Joi.string().required(),
    equipment: Joi.string().optional(),
    duration: Joi.string().optional(),
    notes: Joi.string().optional(),
    status: Joi.string().valid('public', 'private').optional(),
    user: Joi.string().required()
}).options({ stripUnknown: true });

module.exports = {
    usernameSchema,
    userSchema,
    observationSchema
};
