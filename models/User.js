const mongoose = require("mongoose")
const { Schema } = mongoose;

const UserSchema = new Schema({
    email:
    {
        type: String,
        unique: true,
        require: true
    },
    password: String,
    googleId:
    {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }

})
const User = mongoose.model("user", UserSchema)
module.exports = User