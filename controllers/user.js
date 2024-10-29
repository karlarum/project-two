const db = require('../models');
const User = db.user;
const { userSchema } = require('../validators/validation-schema');

const getUsers = async (req, res) => {
    try {
        const data = await User.find({});
        res.status(200).send(data);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving users.'
        });
    }
};

const getSingle = async (req, res) => {
    try {
        const username = req.params.username;
        const data = await User.find({ username: username });
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No user found for this username.' });
        }
        res.status(200).send(data);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send({
            message: 'Error retrieving user',
            error: err
        });
    }
};

const createUser = async (req, res) => {
    try {
        await userSchema.validateAsync(req.body, { abortEarly: false });
        const newUser = new User({
            username: req.body.username,
            contact_information: {
                email: req.body.contact_information.email,
                phone_number: req.body.contact_information.phone_number,
                preferred_contact: req.body.contact_information.preferred_contact
            },
            observation_log: {
                observations: req.body.observation_log.observations || []
            }
        });

        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({
                error: 'Validation error',
                details: err.details.map(detail => detail.message)
            });
        }
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
};

const updateUser = async (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).send({ message: 'Invalid Username Supplied' });
    }
    try {
        await userSchema.validateAsync(req.body, { abortEarly: false });
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        user.username = req.body.username;
        user.contact_information = {
            email: req.body.contact_information.email,
            phone_number: req.body.contact_information.phone_number,
            preferred_contact: req.body.contact_information.preferred_contact,
        };
        if (req.body.observation_log && req.body.observation_log.observations) {
            user.observation_log.observations = req.body.observation_log.observations;
        }
        await user.save();
        res.status(204).send();
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({
                error: 'Validation error',
                details: err.details.map(detail => detail.message)
            });
        }
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
};

const deleteUser = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            return res.status(400).send({ message: 'Invalid Username Supplied' });
        }
        const result = await User.deleteOne({ username: username });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'No user found for this username.' });
        }
        return res.status(200).send({ message: 'User successfully deleted.' });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Some error occurred while deleting the user.', error: err });
    }
};

module.exports = {
    getUsers,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};