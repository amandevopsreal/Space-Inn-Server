const mongoose = require("mongoose")
const { Schema } = mongoose;

const AgentSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email:
    {
        type: String,
        unique: true,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    website:{
        type:String
    },
    assigned_properties:{
        type:Array,
        default:[]
    },
    date: {
        type: Date,
        default: Date.now
    }

})
const User = mongoose.model("agent", AgentSchema)
module.exports = User