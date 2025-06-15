const { verifyToken } = require("../utils/jwt");
const user = require("../models/user");
const cookieParser = require("cookie-parser")

const authenticate = async (req, res, next) => {
    try {
        // Extracting token from header/cookies
        const token = req.cookies.token
        if (!token) {
            return res.status(401).render('error', { 
                message: "Access denied, please log in first",
                error: "No authentication token provided"
            });
        }

        // Verifying token
        const decoded = verifyToken(token);

        // Find user
        const foundUser = await user.findById(decoded.userid).select("-password");
        if (!foundUser) {   // if token is valid but user doesn't exist
            return res.status(401).render('error', { 
                message: "Access denied",
                error: "User no longer exists"
            });
        }

        // adding user to request object
        req.user = foundUser;
        next();
    } catch (error) {
        // Error handling for token expiry
        if (error.name === "TokenExpiredError") {
            return res.status(401).render('error', { 
                message: "Session expired",
                error: "Please log in again"
            });
        }

        // Header/token couldn't be verified by JWT        
        if (error.name === "JsonWebTokenError") {
             return res.status(401).render('error', { 
                message: "Invalid session",
                error: "Please log in again"
            });
        }
        
        // Server error
        return res.status(500).render('error', { 
            message: "Server error during authentication",
            error: error.message
        });
    }
};

module.exports = authenticate;
