const express = require("express");
const router = express.Router();
const { generateToken } = require ("../jwt functions/jwt")
const user = require ("../user_schema_model/user");
const { compare } = require("bcryptjs");

// Main signup route
router.get ("/signup", (req, res) => {
    res.send("Signup endpoint, send post request with signup details")
    console.log(req.method, " request from ", req.url );
})

// Post request for signup
router.post("/signup", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body
        console.log(req.method, " request from ", req.url );

        // Validation
        if (!first_name || !last_name || !email || !password) {
           return res.status(400).json( {message: "All fields are required, you might be missing something..."} )
        }
        
        // checking for existing user
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists..." });
        }

        // Creating a new user
        const newUser = new user({
            first_name,
            last_name,
            email,
            password
        });

        await newUser.save();

        // Generate new token
        const token = generateToken(newUser._id);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email  
            }
        });
    } catch (error) {
        // Only send one response
        if (!res.headersSent) {
            return res.status(500).json({ message: "Server error, user validation failed", error: error.message });
        }
    }
});

// Main login route
router.get("/login", (req, res) => {
    res.status(200).send("Login endpoint, send POST request with login credentials")
    console.log(req.method, " request from ", req.url );
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.method, " request from ", req.url );

        // validation
        if (!email || !password) {
            console.log("might not have entered some stuff");
            return res.status(400).json({ message: "Email and password are required, you might be missing something..." })
        }

        // Finding and validating user
        const foundUser = await user.findOne({ email });
        if (!foundUser) {    // if email doesn't exist
            console.log("Incorrect info/info doesn't align with schema00");
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // checking password
        const isPasswordCorrect = await foundUser.comparePassword(password)
        if (!isPasswordCorrect) {
            console.log("Incorrect info/info doesn't align with schema01"); 
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // generating new token
        const token = generateToken(foundUser._id)

        return res.status(200).json({ 
            message: "Logged in successfully🎉", 
            token,
            user: {
                id: foundUser._id,
                first_name: foundUser.first_name,
                last_name: foundUser.last_name,
                email: foundUser.email
            }
        });

    } catch (error) {
        return res.status(400).json({ message: "server error, unable to log in", error: error.message });
    }
});

module.exports = router;