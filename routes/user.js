const express = require('express');
const passport = require('passport');
const { getUsers, getSingle, createUser, updateUser, deleteUser } = require('../controllers/user');
const { validateUsername, validateUser } = require('../middleware/validation');

const router = express.Router();

// CRUD routes for users
router.route('/')
    .get(getUsers) // Retrieve all users
    .post(validateUser, createUser); // Create a new user with validation

router.route('/:username')
    .get(validateUsername, getSingle) // Get user by username
    .put(validateUsername, validateUser, updateUser) // Update user with validation
    .delete(validateUsername, deleteUser); // Delete user by username

// Google OAuth routes
// @desc Auth with Google
// @route GET /auth/google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google auth callback
// @route GET /auth/google/callback
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard'); // Redirect to dashboard upon successful authentication
    }
);

// @desc Logout user
// @route GET /auth/logout
router.get('/auth/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);
        res.redirect('/'); // Redirect to home after logout
    });
});

module.exports = router;
