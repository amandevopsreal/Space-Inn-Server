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
    listing_status: {
        type: String,
        require: true
    },
    listing_type: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    features: {
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
    date: {
        type: Date,
        default: Date.now
    }

})
const Listing = mongoose.model("listing", ListingSchema)
module.exports = Listing