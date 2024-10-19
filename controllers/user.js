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
        equipment: {
            equipment_type: req.body.equipment.equipment_type,
            make: req.body.equipment.make,
            model: req.body.equipment.model,
            serial_number: req.body.equipment.serial_number
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
        equipment: {
            equipment_type: req.body.equipment.equipment_type,
            make: req.body.equipment.make,
            model: req.body.equipment.model,
            serial_number: req.body.equipment.serial_number
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
