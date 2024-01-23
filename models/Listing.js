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
    features: {
        type: Array,
        require: true
    },
    images: {
        type: Array,
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"

    },
    date: {
        type: Date,
        default: Date.now
    }

})
const Listing = mongoose.model("listing", ListingSchema)
module.exports = Listing