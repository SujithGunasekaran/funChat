const mongoose = require('mongoose');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const { MONGO_URI } = require('../config');

exports.connectMongodb = () => {

    mongoose.connect(`${MONGO_URI}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        },
        () => { console.log("Mongodb connected Successfully"); }
    )

};

exports.mongodbSessionStorage = () => {
    const store = new mongodbStore({
        uri: `${MONGO_URI}`,
        collection: 'funChat-Session'
    });
    return store;
}
