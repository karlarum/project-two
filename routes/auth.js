// const express = require('express');
// const passport = require('passport');
// const router = express.Router();

// router.get('/google', (req, res, next) => {
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })(req, res, next);
// });

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/index.html');
//   }
// );

// module.exports = router;

const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', (req, res, next) => {
    // debugging
    console.log('Starting Google OAuth flow...');
    console.log('Current environment:', process.env.NODE_ENV);
    console.log('Host:', req.get('host'));
    console.log('Protocol:', req.protocol);
  
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        successRedirect: '/dashboard',
        failureFlash: true
    })
);

module.exports = router;