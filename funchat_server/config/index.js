const dotenv = require('dotenv');

dotenv.config();

const config = {
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GOOGLE_CLIENTID: process.env.GOOGLE_CLIENTID,
    GOOGLE_CLIENTSECRET: process.env.GOOGLE_CLIENTSECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    GITHUB_CLIENTID: process.env.GITHUB_CLIENTID,
    GITHUB_CLIENTSECRET: process.env.GITHUB_CLIENTSECRET,
    LOCAL_URL: process.env.LOCAL_URL,
    LOCAL_REDIRECT_URL: process.env.LOCAL_REDIRECT_URL,
    PRODUCTION_REDIRECT_URL: process.env.PRODUCTION_REDIRECT_URL
}

module.exports = config;
