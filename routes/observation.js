const express = require('express');
const {
  getObservations,
  getSingleObservation,
  createObservation,
  updateObservation,
  deleteObservation
} = require('../controllers/observation');
const router = express.Router();

router.route('/').get(getObservations).post(createObservation);

router.route('/:username').get(getSingleObservation).put(updateObservation).delete(deleteObservation);

module.exports = router;
