const express = require ("express");
const app = express()
require ("dotenv").config()

PORT = process.env.PORT || 5000

// importing external route
const authRoute = require ("./routes/auth")

// starting server
app.listen (PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

app.use ( express.json() )
app.use ("/auth", authRoute) // adding external route

app.get ("/", (req, res) => {
    res.status(200).send ("<h1>Welcome to the blogging api by Ikenna Sam-Lebechukwu (ALT/SOE/024/5323)</h1>")
    console.log("Sucessfull GET response");
})