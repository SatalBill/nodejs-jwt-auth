const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { mongoose } = require('../db/mongoose');
const { User } = require('../models/user');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { authenticate, signToken, verifyToken } = require('./authentication');
const { errorDispatcher, successDispatcher } = require('./responsedispatcher');

const JWT_KEY = 'secretkey'; // key for jwt auth.

app.use(bodyParser.json());

app.post('/register', (req, res) => {

    let { username, email } = req.body;

    // check username and email validity.
    Promise.all([User.findOne({ username }), User.findOne({ email })])
           .then(user => {

            if(user[0] && !user[1]) {

                return res.status(404)
                .send(errorDispatcher('username is already registered',
                                       { key: 'user', data: null }));
                    
            } else if (!user[0] && user[1]) {

                return res.status(404)
                .send(errorDispatcher('email is already registered', 
                                      { key: 'user', data: null }));

            } else if(user[0] && user[1]) {

                return res.status(404)
                .send(errorDispatcher('username and email are already registered',
                                      { key: 'user', data: null }));

            }

            console.log('-> Creating User');
            User.create({ ...req.body }, (error, user) => {

                if(error) return res.status(404).send(error); //FIXME:

                res.send(successDispatcher(null,
                         { key: 'user', data: user._doc },
                         { key: 'token', data: signToken({ email: user.email, password: user.password }, JWT_KEY) }));
            });
        }).catch(error => console.log(error));
});

app.post('/login', (req, res) => {

    let { email, password } = req.body;
    let userData = null;

    // check if user exists and the password matches.

    User.findOne({ email })
    .then(user => {
    
      userData = user._doc;
      console.log('[?] Checking if the user exists.');
        if (!user) return res.status(404)
                             .send(errorDispatcher('user does not exist',
                                   { key: 'token', data: null }));
        
      console.log('[√] User exists.');
      // checking password
      return bcrypt.compare(password, user.password); //returns a promise.
    })
    .then(doesPassMatch => {

        console.log('[?] Checking if password matches.');
        if (doesPassMatch === false) return res.status(404)
                                               .send(errorDispatcher('password provided is wrong', 
                                                     { key: 'token', data: null }));

        console.log('[√] Password matches with the database.');

        console.log('[ø] USER EXISTS AND PASS MATCHES');

        // jwt generate token:
        console.log('[*] [GENERATING TOKEN]');

        res.send(successDispatcher(null,
                 { key: 'token', data: signToken(userData, JWT_KEY)}));

    }).catch(error => console.log('[X] USER ERROR: ' + error));

});

app.post('/logout', (req, res) => { });

app.get('/list', authenticate, (req, res) => {

    let authData = null;

    try { authData = verifyToken(req.token, JWT_KEY); } 
    catch (error) {
        
        return res.status(404) //TODO: rename the 'data' key.
                  .send(errorDispatcher('cannot verify the auth token',
                        { key: 'data', data: null }));
    }
    console.log(authData); // Verified token data.

    // send personal data or manipulate the Db once verified.
    User.find().then(users => res.send(successDispatcher(null, { key: 'users', data: users })))
               .catch(error => res.status(404).send(error));
});

app.listen(port, () => console.log(`Server is up on port ${port}`));