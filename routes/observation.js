const express = require('express');
const router = express.Router();
const { getObservations, getSingleObservation, createObservation, updateObservation, deleteObservation
} = require('../controllers/observation');
const { validateUsername, validateObservation } = require('../middleware/validation');
const { ensureAuth } = require('../middleware/user');

// @desc    Get all observations
// @route   GET /observations
router.get('/', ensureAuth, getObservations);

// @desc    Create a new observation
// @route   POST /observations
router.post('/', ensureAuth, validateObservation, createObservation);

// @desc    Get a single observation by username
// @route   GET /observations/:username
router.get('/:username', ensureAuth, validateUsername, getSingleObservation);

// @desc    Update an observation
// @route   PUT /observations/:username
router.put('/:username', ensureAuth, validateUsername, validateObservation, updateObservation);

// @desc    Delete an observation
// @route   DELETE /observations/:username
router.delete('/:username', ensureAuth, validateUsername, deleteObservation);

module.exports = router;
