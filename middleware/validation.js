const { usernameSchema, userSchema, observationSchema } = require('../validators/validation-schema');

const validateUsername = async (req, res, next) => {
    try {
        await usernameSchema.validateAsync({ username: req.params.username }, { abortEarly: false });
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation error',
            details: err.details.map(detail => detail.message)
        });
    }
}

const validateUser = async (req, res, next) => {
    try {
        const validated = await userSchema.validateAsync(req.body, { abortEarly: false });
        req.body = validated;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation error',
            details: err.details.map(detail => detail.message)
        });
    }
};

const validateObservation = async (req, res, next) => {
    try {
        const validated = await observationSchema.validateAsync(req.body, { abortEarly: false });
        req.body = validated;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation error',
            details: err.details.map(detail => detail.message)
        });
    }
};

module.exports = {
    validateUsername,
    validateUser,
    validateObservation
};