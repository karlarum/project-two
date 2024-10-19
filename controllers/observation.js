const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getObservations = async (req, res) => {
    try {
        const db = mongodb.getDb().db();
        const observations = await db.collection('observation').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(observations);
    } catch (err) {
        console.error('Error fetching observations:', err);
        res.status(500).send('Internal Server Error');
    }
};
const getSingleObservation = async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const db = mongodb.getDb().db();
        const observation = await db.collection('observation').findOne({ _id: new ObjectId(id) });
        if (!observation) {
            return res.status(404).send('Observation not found');
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(observation);
    } catch (err) {
        console.error('Error fetching observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const createObservation = async (req, res) => {
    const newObservation = {
        observation: req.body.observation,
        object_type: req.body.object_type,
        date: req.body.date,
        time: req.body.time,
        location: {
            country: req.body.location.country,
            state: req.body.location.state,
            city: req.body.location.city,
            coordinates: {
                latitude: req.body.location.coordinates.latitude,
                longitude: req.body.location.coordinates.longitude
            }
        },
        telescope: {
            make: req.body.telescope.make,
            serial_number: req.body.telescope.serial_number
        },
        weather_conditions: req.body.weather_conditions,
        visibility_conditions: req.body.visibility_conditions,
        duration: req.body.duration,
        notes: req.body.notes
    };
    try {
        const db = mongodb.getDb().db();
        const result = await db.collection('observation').insertOne(newObservation);
        const createdObservation = await db.collection('observation').findOne({ _id: result.insertedId });
        res.status(201).json(createdObservation);
    } catch (err) {
        console.error('Error creating observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const updateObservation = async (req, res) => {
    const id = req.params.id;
    const updatedObservation = {
        observation: req.body.observation,
        object_type: req.body.object_type,
        date: req.body.date,
        time: req.body.time,
        location: {
            country: req.body.location.country,
            state: req.body.location.state,
            city: req.body.location.city,
            coordinates: {
                latitude: req.body.location.coordinates.latitude,
                longitude: req.body.location.coordinates.longitude
            }
        },
        telescope: {
            make: req.body.telescope.make,
            serial_number: req.body.telescope.serial_number
        },
        weather_conditions: req.body.weather_conditions,
        visibility_conditions: req.body.visibility_conditions,
        duration: req.body.duration,
        notes: req.body.notes
    };

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const db = mongodb.getDb().db();
        const result = await db.collection('observation').replaceOne({ _id: new ObjectId(id) }, updatedObservation);

        if (result.matchedCount === 0) {
            return res.status(404).send('Observation not found');
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error updating observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const deleteObservation = async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const db = mongodb.getDb().db();
        const result = await db.collection('observation').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send('Observation not found');
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getObservations,
    getSingleObservation,
    createObservation,
    updateObservation,
    deleteObservation
};
