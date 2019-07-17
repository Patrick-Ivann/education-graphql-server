const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const url = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@ds261136.mlab.com:${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`


mongoose.connect(url, { useNewUrlParser: true, useFindAndModify:false });
mongoose.connection.once('open', () => console.log(`Connected to mongo `));