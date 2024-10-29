const express = require('express');
const { getObservations, getSingleObservation, createObservation, updateObservation, deleteObservation } = require('../controllers/observation');
const { validateObservation } = require('../middleware/validation');

const router = express.Router();

router.route('/')
  .get(getObservations)
  .post(validateObservation, createObservation);

router.route('/:username')
  .get(getSingleObservation)
  .put(validateObservation, updateObservation)
  .delete(deleteObservation);

module.exports = router;
