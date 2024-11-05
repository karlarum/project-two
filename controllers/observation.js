const db = require('../models');
const Observation = db.observation;
const { observationSchema } = require('../validators/validation-schema');

const getObservations = async (req, res) => {
    try {
        const data = await Observation.find({ user: req.user.id });
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
        const observation = await Observation.findById(req.params.id).populate('user');
        if (!observation) {
            return res.status(404).json({ message: 'Observation not found.' });
        }
        res.status(200).send(observation);
    } catch (err) {
        console.error('Error fetching observation:', err);
        res.status(500).send({
            message: 'Error retrieving observation',
            error: err
        });
    }
};

const createObservation = async (req, res) => {
    try {
        await observationSchema.validateAsync(req.body, { abortEarly: false });
        const newObservation = new Observation({
            ...req.body,
            user: req.user.id,
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
    try {
        await observationSchema.validateAsync(req.body, { abortEarly: false });
        const observation = await Observation.findById(req.params.id);
        if (!observation || observation.user.toString() !== req.user.id) {
            return res.status(404).send({ message: 'Observation not found.' });
        }

        Object.assign(observation, req.body);
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
        const observation = await Observation.findById(req.params.id);
        if (!observation || observation.user.toString() !== req.user.id) {
            return res.status(404).send({ message: 'Observation not found.' });
        }

        await Observation.deleteOne({ _id: req.params.id });
        return res.status(200).send({ message: 'Observation successfully deleted.' });
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
