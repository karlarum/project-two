const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/user', require('./user'));
router.use('/observation', require('./observation'));

module.exports = router;