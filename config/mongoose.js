const mongoose = require ("mongoose")
require ("dotenv").config()

const connect_DB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log ("🎉 Mongoose database connected successfully. 🎉")
    }catch (error) {
        console.log ("An error occurred connecting to database. 💔 ", error)
        process.exit (1)    // stops website from building despite failing
    }
}
module.exports = connect_DB;