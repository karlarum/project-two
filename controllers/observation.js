const db = require('../models');
const Observation = db.observation;
const { observationSchema } = require('../validators/validation-schema');

const getObservations = async (req, res) => {
    try {
        const data = await Observation.find({});
        res.status(200).send(data);
    } catch (err) {
        console.error('Error retrieving observations:', err);
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving observations.'
        });
    }
};

const getSingleObservation = async (req, res) => {
    try {
        const username = req.params.username;
        const data = await Observation.find({ username: username });
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No observation found for this username.' });
        }
        res.status(200).send(data);
    } catch (err) {
        console.error('Error fetching observation:', err);
        res.status(500).send({
            message: 'Error retrieving observations',
            error: err
        });
    }
};

const createObservation = async (req, res) => {
    try {
        await observationSchema.validateAsync(req.body, { abortEarly: false });
        const newObservation = new Observation({
            username: req.body.username,
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
            equipment: {
                equipment_type: req.body.equipment.equipment_type,
                make: req.body.equipment.make,
                model: req.body.equipment.model,
                serial_number: req.body.equipment.serial_number
            },
            weather_conditions: req.body.weather_conditions,
            visibility_conditions: req.body.visibility_conditions,
            duration: req.body.duration,
            notes: req.body.notes,
        });

        const observation = await newObservation.save();
        res.status(201).json(observation);
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({
                error: 'Validation error',
                details: err.details.map(detail => detail.message)
            });
        }
        console.error('Error creating observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const updateObservation = async (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).send({ message: 'Invalid Username Supplied' });
    }
    try {
        await observationSchema.validateAsync(req.body, { abortEarly: false });
        const observation = await Observation.findOne({ username: username });
        if (!observation) {
            return res.status(404).send({ message: 'Observation not found' });
        }
        observation.observation = req.body.observation;
        observation.object_type = req.body.object_type;
        observation.date = req.body.date;
        observation.time = req.body.time;
        observation.location = {
            country: req.body.location.country,
            state: req.body.location.state,
            city: req.body.location.city,
            coordinates: {
                latitude: req.body.location.coordinates.latitude,
                longitude: req.body.location.coordinates.longitude
            }
        };
        observation.equipment = {
            equipment_type: req.body.equipment.equipment_type,
            make: req.body.equipment.make,
            model: req.body.equipment.model,
            serial_number: req.body.equipment.serial_number
        };
        observation.weather_conditions = req.body.weather_conditions;
        observation.visibility_conditions = req.body.visibility_conditions;
        observation.duration = req.body.duration;
        observation.notes = req.body.notes;

        await observation.save();
        res.status(204).send();
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({
                error: 'Validation error',
                details: err.details.map(detail => detail.message)
            });
        }
        console.error('Error updating observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const deleteObservation = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            return res.status(400).send({ message: 'Invalid Username Supplied' });
        }
        const result = await Observation.deleteOne({ username: username });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'No observation found for this username.' });
        }
        return res.status(200).send({ message: 'User successfully deleted.' });
    } catch (err) {
        console.error('Error deleting observation:', err);
        return res.status(500).json({ message: 'Some error occurred while deleting the observation.', error: err });
    }
};

module.exports = {
    getObservations,
    getSingleObservation,
    createObservation,
    updateObservation,
    deleteObservation
};