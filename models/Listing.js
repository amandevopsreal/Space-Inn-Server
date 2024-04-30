const mongoose = require("mongoose")
const { Schema } = mongoose;

const ListingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    configuration: {
        type: Number,
        require: true
    },
    minPrice: {
        type: Number,
        require: true
    },
    maxPrice: {
        type: Number,
        require: true
    },
    average_price: {
        type: Number
    },
    emi: {
        type: Number,
        require: true
    },
    contact_number: {
        type: String,
        require: true
    },
    contact_email: {
        type: String,
        require: true
    },
    minArea: {
        type: Number,
        require: true
    },
    maxArea: {
        type: Number,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    amenties: {
        type: Array,
        require: true
    },
    images: {
        type: Array,
        default: []
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    owner: {
        type: String,
        require: true
    },
    possession_date: {
        type: Date,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        require: true
    },
    estdDate: {
        type: Date,
        require: true
    },
    projects: {
        type: Number,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    pin: {
        type: String,
        require: true
    },
    broucher: {
        type: String,
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agent"
    },
})
const Listing = mongoose.model("listing", ListingSchema)
module.exports = Listing