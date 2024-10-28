const express = require('express');
const { getUsers, getSingle, createUser, updateUser, deleteUser } = require('../controllers/user');
const { validateUser } = require('../middleware/validation');
const router = express.Router();

router.route('/')
    .get(getUsers)
    .post(validateUser, createUser);

router.route('/:username')
    .get(getSingle)
    .put(validateUser, updateUser)
    .delete(deleteUser);

module.exports = router;
