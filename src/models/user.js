const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let UserSchema = mongoose.Schema({

    username: {

        type: String,
        required: true,
        trim: true
    },
    email: {

        type: String,
        required: true,
        trim: true
    },
    password: {

        type: String,
        required: true
    }
});

UserSchema.pre('save', function (next) {

    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {

        if (err) return next(err);

        user.password = hash;
        next();
    });
});

let User = mongoose.model('User', UserSchema);

module.exports = {

    User
};