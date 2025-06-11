const mongoose = require ("mongoose")
require ("dotenv").config()

const databaseURI = process.env.mongoDB_URI

const connect_DB = async () => {
    try {
        await mongoose.connect(databaseURI)
        console.log ("🎉 Mongoose database connected successfully. 🎉")
    }catch (error) {
        console.log ("An error occurred connecting to database. 💔")
        process.exit (1)    // stops code from continuing despite a failure.
    }
}
module.exports = connect_DB;