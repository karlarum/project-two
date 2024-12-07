const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/user');
const observationRoutes = require('./observation');
const userRoutes = require('./user');

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
});

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const observations = await observationRoutes(req, res);
        res.render('dashboard', {
            name: req.user.firstName,
            observations,
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

router.use('/observation', observationRoutes);

router.use('/user', userRoutes);

module.exports = router;
