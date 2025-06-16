const express = require("express");
const router = express.Router();
const { generateToken } = require ("../utils/jwt")
const user = require ("../models/user");
const { compare } = require("bcryptjs");


// Render signup form ejs
router.get('/signup', (req, res) => {
    res.render('signup')
})

// Render login form ejs
router.get('/login', (req, res) => {
    res.render('login')
})


// Post request for signup
router.post("/signup", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body
        console.log(req.method, " request to url ", req.url );

        // Validation
        if (!first_name || !last_name || !email || !password) {
           return res.status(400).render( {message: "All fields are required, you might be missing something...", error: null} )
        }
        
        // checking for existing user
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).render({ message: "A user with this email already exists...", error: null });
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
        const token = generateToken(newUser._id);   // ._id is the default object key mongodb creates and stores unique ids for schemas in.

        // Set httpOnly cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // cookie will only be sent over https if NODE_ENV is "production" i.e you're on a production build of node js. Otherwise, apparently it defaults to "development"
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        // Also send token in response header
        res.setHeader('Authorization', `Bearer ${token}`)

        return res.redirect("/")

    } catch (error) {
        // Only send one response
        if (!res.headersSent) {
            return res.status(500).render({ message: "Server error, user validation failed", error: error.message });
        }
    }
});

// Post request for login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.method, " request to url ", req.url );

        // validation
        if (!email || !password) {
            console.log("might not have entered some stuff");
            return res.status(400).render({ message: "Email and password are required, you might be missing something...", error: null })
        }

        // Finding and validating user
        const foundUser = await user.findOne({ email });
        if (!foundUser) {    // if email doesn't exist
            console.log("Incorrect info/info doesn't align with schema00");
            return res.status(400).render("error",{ message: "Invalid email or password", error: null})
        }

        // checking password
        const isPasswordCorrect = await foundUser.comparePassword(password)
        if (!isPasswordCorrect) {
            console.log("Incorrect info/info doesn't align with schema01"); 
            return res.status(400).render({ message: "Invalid email or password", error: null })
        }

        // generating new token
        const token = generateToken(foundUser._id)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        return res.redirect('/')

    } catch (error) {
        return res.status(400).render({ message: "server error, unable to log in", error: error.message });
    }
});

module.exports = router;