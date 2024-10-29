const express = require('express');
const { getUsers, getSingle, createUser, updateUser, deleteUser } = require('../controllers/user');
const { validateUsername, validateUser } = require('../middleware/validation');

const router = express.Router();

router.route('/')
    .get(getUsers)
    .post(validateUser, createUser);

router.route('/:username')
    .get(validateUsername, getSingle)
    .put(validateUser, updateUser)
    .delete(validateUsername, deleteUser);

module.exports = router;
