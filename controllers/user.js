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
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).send(user);
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
            googleId: req.body.googleId,
            displayName: req.body.displayName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            image: req.body.image
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
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).send({ message: 'Invalid User ID Supplied' });
    }
    try {
        await userSchema.validateAsync(req.body, { abortEarly: false });
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.displayName = req.body.displayName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.image = req.body.image;

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
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).send({ message: 'Invalid User ID Supplied' });
        }
        const result = await User.deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'No user found for this ID.' });
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