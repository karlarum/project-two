const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/user');
const observationRoutes = require('./observation');
const userRoutes = require('./user');

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const observations = await observationRoutes.getUsers(req, res);
        res.render('dashboard', {
            name: req.user.firstName,
            observations,
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

router.use('/observations', observationRoutes);

router.use('/users', userRoutes);

module.exports = router;
