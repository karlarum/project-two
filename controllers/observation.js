const Observation = require('../models/observation');

const getObservations = async (req, res) => {
    try {
        const observations = await Observation.find();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(observations);
    } catch (err) {
        console.error('Error fetching observations:', err);
        res.status(500).send('Internal Server Error');
    }
};

const getSingleObservation = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const observation = await Observation.findOne({ username });
        if (!observation) {
            return res.status(404).json('Observation not found');
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(observation);
    } catch (err) {
        console.error('Error fetching observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const createObservation = async (req, res) => {
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
            model: req.body.equipment.make,
            serial_number: req.body.equipment.serial_number
        },
        weather_conditions: req.body.weather_conditions,
        visibility_conditions: req.body.visibility_conditions,
        duration: req.body.duration,
        notes: req.body.notes,
    });
    try {
        await newObservation.save();
        res.status(201).json(newObservation);
    } catch (err) {
        console.error('Error creating observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const updateObservation = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json('Invalid Username Supplied');
    }

    try {
        const updatedObservation = await Observation.findOneAndUpdate(
            { username },
            {
                $set: {
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
                        model: req.body.equipment.make,
                        serial_number: req.body.equipment.serial_number
                    },
                    weather_conditions: req.body.weather_conditions,
                    visibility_conditions: req.body.visibility_conditions,
                    duration: req.body.duration,
                    notes: req.body.notes
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedObservation) {
            return res.status(404).json('Observation not found');
        }
        res.status(200).json(updatedObservation);
    } catch (err) {
        console.error('Error updating observation:', err);
        res.status(500).send('Internal Server Error');
    }
};

const deleteObservation = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json('Username is required');
    }

    try {
        const result = await Observation.deleteOne({ username });

        if (result.deletedCount === 0) {
            return res.status(404).json('Observation not found');
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