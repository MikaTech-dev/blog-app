const express = require("express");
const router = express.Router();

router.get ("/signup", (req, res) => {
    res.send("Signup endpoint, send post request with signup details")
})

router.post("/signup", (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400)
        res.send({mesage: "You didn't send an email or a password along with your request."})
    }
    res.send (`User with email: ${email}, created successfully 🎉`)
    console.log("User registered...");
    
}); 

router.get ("/login", (req, res)=> {
    res.status(200).send ("Login endpoint")
})
module.exports = router