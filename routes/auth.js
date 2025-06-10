const express = require("express")
const router = express.Router()

// POST auth/signup
router.post ("/signup", (req, res) => {
    res.send ("Signup endpoint")
})

// POST auth/login
router.post ("/signup", (req, res) => {
    res.send ("Login endpoint")
})

module.exports = router;