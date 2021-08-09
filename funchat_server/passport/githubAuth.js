const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../config');
const User = require('../mongodb/model/userSchema');
const onlineUser = require('../mongodb/model/OnlineUserSchema');

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
        const username = displayName.split(' ').map(name => `${name[0].toUpperCase()}${name.slice(1).toLowerCase()}`).join(' ');
        try {
            const user = await User.findOne({ userid: id, authType: 'Github' });
            if (user) {
                // const onlineUserList = await onlineUser.findOne({ userid: user._id });
                // if (!onlineUserList) {
                //     await onlineUser.create({
                //         userid: user._id,
                //         username: user.username,
                //         profile: user.profile,
                //         statusType: 'online'
                //     })
                // }
                done(null, user);
            }
            if (!user) {
                const newUser = new User({ userid: id, username, profile: photos[0].value, authType: 'Github' });
                // const onlineUserList = await onlineUser.findOne({ userid: newUser._id });
                // if (!onlineUserList) {
                //     await onlineUser.create({
                //         userid: newUser._id,
                //         username: newUser.username,
                //         profile: user.profile,
                //         statusType: 'online'
                //     })
                // }
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
