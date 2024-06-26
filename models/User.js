const mongoose = require("mongoose")
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String
    },
    phone:{
        type:String
    },
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
    saved_properties:{
        type:Array,
        default:[]
    },
    date: {
        type: Date,
        default: Date.now
    }

})
const User = mongoose.model("user", UserSchema)
module.exports = User