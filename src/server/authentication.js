const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {

    // authorization header as sent from the client.
    const bearerHeader = req.headers['authorization'];
    // console.log(req.headers);


    // null check.
    if (typeof bearerHeader === 'undefined') return res.sendStatus(403);

    // split the token.
    let token = bearerHeader.split(' ')[1];

    // set the token.
    req.token = token;

    // call next middleware.
    next();
};

const signToken = (payload, secret) => {
    
    return jwt.sign({ ...payload }, secret);
};

const verifyToken = (token, secret) => {

    return jwt.verify(token, secret);
};

module.exports = {

    authenticate,
    signToken,
    verifyToken
};