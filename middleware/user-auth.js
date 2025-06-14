const { verifyToken } = require("../utils/jwt");
const user = require("../models/user");
const cookieParser = require("cookie-parser")

const authenticate = async (req, res, next) => {
    try {
        // Extracting token from header/cookies
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Access denied, no token provided" })
        }

        // Verifying token
        const decoded = verifyToken(token);

        // Find user
        const foundUser = await user.findById(decoded.userid).select("-password");
        if (!foundUser) {
            return res.status(401).json({ message: "Token is valid but this user no longer exists" });
        }

        // adding user to request object
        req.user = foundUser;
        next();
    } catch (error) {
        // Error handling for token expiry
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        return res.status(500).json({ message: "Server error during authentication" , error: error.message });
    }
};

module.exports = authenticate;
