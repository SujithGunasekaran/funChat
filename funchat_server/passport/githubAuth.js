const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../config');
const User = require('../mongodb/model/userSchema');

const { GITHUB_CLIENTID, GITHUB_CLIENTSECRET, GITHUB_CALLBACK_URL } = config;

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})


passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENTID,
    clientSecret: GITHUB_CLIENTSECRET,
    callbackURL: `${GITHUB_CALLBACK_URL}`
},
    async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, photos } = profile;
        try {
            const user = await User.findOne({ userid: id, authType: 'Github' });
            if (user) done(null, user);
            if (!user) {
                const newUser = new User({ userid: id, username: displayName, profile: photos[0].value, authType: 'Github' });
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
