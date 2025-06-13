const { verifyToken } = require("../jwt functions/jwt");
const user = require("../user_schema_model/user");

const authenticate = async (req, res, next) => {
    try {
        // Extracting token from header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied, no token provided" });
        }

        // Formatting and extracting token
        const token = authHeader.substring(7);

        // Verifying token
        const decoded = await verifyToken(token);

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
            return res.status(401).json({ message: 'Token has expired' });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        return res.status(500).json({ message: 'Server error during authentication', error: error.message });
    }
};

module.exports = authenticate;
