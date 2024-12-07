const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models'); 
const User = db.user;

module.exports = (passport) => {
    // debugging
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);

    const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://project-two-hu6p.onrender.com/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback';

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });
                    if (!user) {
                        user = new User({
                            googleId: profile.id,
                            displayName: profile.displayName,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            image: profile.photos[0]?.value,
                        });
                        await user.save();
                    }
                    done(null, user);
                } catch (err) {
                    console.error('Error during Google OAuth:', err);
                    done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
