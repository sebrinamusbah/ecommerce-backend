const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/auth");

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: jwtExpire,
    });
};

module.exports = generateToken;