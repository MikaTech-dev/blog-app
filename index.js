const express = require ("express");
const app = express()
const connectDB = require ("./config/mongoose")
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
const cookieParser = require("cookie-parser")
app.use(cookieParser())

// EJS view engine and static files setup
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.urlencoded({ extended: true })) // For form data


// Lets see if we can setup protected routes
const authenticate = require ("./middleware/user-auth")
app.get ("/protected", authenticate, (req, res) => {
    res.json( {message: "This is a protected route!!", user: req.user} )
})



// Routes
app.use ("/auth", require ("./routes/signup-login-auth")) // adding signup/login route
app.use ("/api", require ("./routes/blog_routes"))          // blog routes
app.use ("/", require("./routes/blog_routes"))
app.use (authenticate)

app.get ("/", (req, res) => {
    res.status(200).send ("<h1>Blog api by Ikenna Sam-Lebechukwu (ALT/SOE/024/5323)</h1>")
    console.log("Sucessfull GET response");
})

// Render create blog form (EJS view)
app.get('/blog/create', authenticate, (req, res) => {
    res.render('create-blog')
})

connectDB();