// const User = require('../models/user');

// const getUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json(users);
//     } catch (err) {
//         console.error('Error fetching users:', err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// const getSingle = async (req, res) => {
//     const username = req.params.username;

//     if (!username) {
//         return res.status(400).json('Username is required');
//     }

//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).json('User not found');
//         }
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json(user);
//     } catch (err) {
//         console.error('Error fetching user:', err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// const createUser = async (req, res) => {
//     const newUser = new User({
//         username: req.body.username,
//         contact_information: {
//             email: req.body.contact_information.email,
//             phone_number: req.body.contact_information.phone_number,
//             preferred_contact: req.body.contact_information.preferred_contact
//         },
//         observation_log: {
//             observations: req.body.observation_log.observations || []
//         }
//     });

//     try {
//         await newUser.save();
//         res.status(201).json(newUser);
//     } catch (err) {
//         console.error('Error creating user:', err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// const updateUser = async (req, res) => {
//     const username = req.params.username;

//     if (!username) {
//         return res.status(400).json('Invalid Username Supplied');
//     }

//     try {
//         const updatedUser = await User.findOneAndUpdate(
//             { username },
//             {
//                 $set: {
//                     username: req.body.username,
//                     contact_information: {
//                         email: req.body.contact_information.email,
//                         phone_number: req.body.contact_information.phone_number,
//                         preferred_contact: req.body.contact_information.preferred_contact
//                     },
//                     observation_log: {
//                         observations: req.body.observation_log.observations || []
//                     }
//                 }
//             },
//             { new: true, runValidators: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json('User not found');
//         }

//         res.status(200).json(updatedUser);
//     } catch (err) {
//         console.error('Error updating user:', err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// const deleteUser = async (req, res) => {
//     const username = req.params.username;

//     if (!username) {
//         return res.status(400).json('Username is required');
//     }

//     try {
//         const result = await User.deleteOne({ username });

//         if (result.deletedCount === 0) {
//             return res.status(404).json('User not found');
//         }
//         res.status(204).send();
//     } catch (err) {
//         console.error('Error deleting user:', err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// module.exports = {
//     getUsers,
//     getSingle,
//     createUser,
//     updateUser,
//     deleteUser
// };


// ORIGINAL CODE

const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const getUsers = async (req, res) => {
    try {
        const db = mongodb.getDb().db();
        const users = await db.collection('user').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
};
const getSingle = async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }
    try {
        const db = mongodb.getDb().db();
        const user = await db.collection('user').findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching contact:', err);
        res.status(500).send('Internal Server Error');
    }
};
const createUser = async (req, res) => {
    const newUser = {
        username: req.body.username,
        contact_information: {
            email: req.body.contact_information.email,
            phone_number: req.body.contact_information.phone_number,
            preferred_contact: req.body.contact_information.preferred_contact
        },
        observation_log: {
            observations: req.body.observation_log.observations || []
        }
    };
    try {
        const db = mongodb.getDb().db();
        const result = await db.collection('user').insertOne(newUser);
        const createdUser = await db.collection('user').findOne({ _id: result.insertedId });
        res.status(201).json(createdUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
};
const updateUser = async (req, res) => {
    const id = req.params.id;
    const updatedUser = {
        username: req.body.username,
        contact_information: {
            email: req.body.contact_information.email,
            phone_number: req.body.contact_information.phone_number,
            preferred_contact: req.body.contact_information.preferred_contact
        },
        observation_log: {
            observations: req.body.observation_log.observations || []
        }
    };
    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }
    try {
        const db = mongodb.getDb().db();
        const result = await db.collection('user').replaceOne({ _id: new ObjectId(id) }, updatedUser);
        if (result.matchedCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
};
const deleteUser = async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }
    try {
        const db = mongodb.getDb().db();
        const result = await db.collection('user').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    getUsers,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};