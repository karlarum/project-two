const Joi = require('joi');

const usernameSchema = Joi.object({
    username: Joi.string().min(5).required()
});

const userSchema = Joi.object({
    username: Joi.string().min(5).required(),
    contact_information: Joi.object({
        email: Joi.string().email().required(),
        phone_number: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
        preferred_contact: Joi.string().valid('email', 'phone').required()
    }).required(),
    observation_log: Joi.object({
        observations: Joi.array().items(Joi.string()).optional()
    }).optional()
}).options({ stripUnknown: true });

const observationSchema = Joi.object({
    username: Joi.string().required(),
    observation: Joi.string().required(),
    object_type: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().optional(),
    time_zone: Joi.string().optional(),
    location: Joi.object({
        country: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        coordinates: Joi.object({
            latitude: Joi.number().optional(),
            longitude: Joi.number().optional()
        }).optional()
    }).required(),
    equipment: Joi.object({
        equipment_type: Joi.string().optional(),
        make: Joi.string().optional(),
        model: Joi.string().optional(),
        serial_number: Joi.string().optional()
    }).optional(),
    weather_conditions: Joi.string().optional(),
    visibility_conditions: Joi.string().optional(),
    duration: Joi.string().optional(),
    notes: Joi.string().optional()
}).optional({ stripUnknown: true });

module.exports = {
    usernameSchema,
    userSchema,
    observationSchema
};