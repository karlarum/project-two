const express = require('express');
const { getUsers, getSingle, createUser, updateUser, deleteUser } = require('../controllers/user');
const router = express.Router();

router.route('/').get(getUsers).post(createUser);

router.route('/:username').get(getSingle).put(updateUser).delete(deleteUser);

module.exports = router;
