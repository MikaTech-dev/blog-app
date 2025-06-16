const express = require ("express");
const app = express()
const connectDB = require ("./config/mongoose")
require ("dotenv").config()
// importing external route
const authRoute = require ("./routes/signup-login-auth")
const authenticate = require ("./middleware/user-auth")


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
app.use(express.urlencoded({ extended: true })) //  Parse URL-encoded bodies (HTML forms send data encoded in the URL upon submission)

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

// EZ method to catch all undefined routes and serve our own error page
app.use((req, res) => {
    res.status(404).render('error', {
        message: "The page you are looking for does not exist.",
        error: "404 Not Found"
    })
})

connectDB();
module.exports = app