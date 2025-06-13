const express = require ("express");
const app = express()
const connectDB = require ("./db_config/mongoose")
require ("dotenv").config()
// importing external route
const authRoute = require ("./routes/signup-login-auth")


PORT = process.env.PORT || 5000 // importing port from dotenv and including a redundant port

// starting server
app.listen (PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

// Middleware
app.use ( express.json() )


// Lets see if we can setup protected routes
const authenticate = require ("./middleware/user-auth")
app.get ("/protected", authenticate, (req, res) => {
    res.json( {message: "This is a protected route!!", user: req.user} )
})

// Routes
app.use ("/auth", require ("./routes/signup-login-auth")) // adding signup route
app.use ("/api", require ("./routes/blog_routes"))
app.use (authenticate)

app.get ("/", (req, res) => {
    res.status(200).send ("<h1>Welcome to the one blog api by Ikenna Sam-Lebechukwu (ALT/SOE/024/5323)</h1>")
    console.log("Sucessfull GET response");
})

connectDB();