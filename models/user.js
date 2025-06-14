// User auth
const mongoose = require ("mongoose")
const bcrypt = require ("bcryptjs")


// Creating signup schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Your email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "You need a password to signup"],
        minlength: [6, "You need to enter at least 6 words to continue"]
    }, 
}/*closes the first object*/, { timestamps: true })    // automatically adds createdAt and updatedAt


// Hashing the password before saving

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next
    }
    this.password = await bcrypt.hash(this.password, 10)    // hashing the password with a cost of 12 (the password gets hashed 12 times) 
    next();
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema)