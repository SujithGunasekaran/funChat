const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');
const User = require('../mongodb/model/userSchema');

const { GOOGLE_CLIENTID, GOOGLE_CLIENTSECRET, GOOGLE_CALLBACK_URL } = config;

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})

passport.use(new GoogleStrategy({
    clientID: `${GOOGLE_CLIENTID}`,
    clientSecret: `${GOOGLE_CLIENTSECRET}`,
    callbackURL: `${GOOGLE_CALLBACK_URL}`
},
    async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, photos } = profile;
        const username = displayName.split(' ').map(name => `${name[0].toUpperCase()}${name.slice(1).toLowerCase()}`).join(' ');
        try {
            const user = await User.findOne({ userid: id, authType: 'Google' });
            if (user) done(null, user);
            if (!user) {
                const newUser = new User({ userid: id, username, profile: photos[0].value, authType: 'Google' });
                const savedUser = await newUser.save();
                done(null, savedUser);
            }
        }
        catch (err) {
            console.log(err);
            done(null, profile);
        }
    }
));
