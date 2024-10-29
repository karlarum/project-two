const express = require('express');
const { getObservations, getSingleObservation, createObservation, updateObservation, deleteObservation } = require('../controllers/observation');
const { validateUsername, validateObservation } = require('../middleware/validation');

const router = express.Router();

router.route('/')
  .get(getObservations)
  .post(validateObservation, createObservation);

router.route('/:username')
  .get(validateUsername, getSingleObservation)
  .put(validateObservation, updateObservation)
  .delete(validateUsername, deleteObservation);

module.exports = router;
