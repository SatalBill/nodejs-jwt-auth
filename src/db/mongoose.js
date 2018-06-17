const mongoose = require('mongoose');

let URI = 'mongodb://localhost:27017/Database';

mongoose.Promise = global.Promise;
mongoose.connect(URI);

module.exports = {

    mongoose
};