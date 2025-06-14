// Setting up JWT
const jwt = require ("jsonwebtoken")
require ("dotenv").config()

// Generating a JWT token

const generateToken = (userid) => {
    return jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

// Verifying jwt token

const verifyToken = (token) => {
    return jwt.verify (token, process.env.JWT_SECRET)
}

module.exports = {
    generateToken,
    verifyToken
};