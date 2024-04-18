const express = require("express")
const router = express.Router()
const Listing = require("../models/Listing")
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser.js")

router.post("/create", fetchUser, [body('title', "Enter a valid title").isLength({ min: 3 }), body('description', "Description must be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
    const { title, description, tag } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const listing = await Listing.create(req.body)
        res.json(listing)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

router.get("/featured/:location", async (req, res) => {
    try {
        const properties = await Listing.find({ location: req.params.location }).sort({ date: 1 }).limit(4)
        res.status(200).json(properties)
    }
    catch (err) {
        res.status(500).json("Something went wrong.")
    }
})

router.get("/upcoming/:location", async (req, res) => {
    try {
        const properties = await Listing.find({ location: req.params.location, listing_status: "upcoming" }).sort({ date: 1 }).limit(6)
        res.status(200).json(properties)
    }
    catch (err) {
        res.status(500).json("Something went wrong.")
    }
})

router.get("/property/view/:_id", async (req, res) => {
    try {
        const property = await Listing.findOne({ _id: req.params._id })
        res.status(200).json(property)
    }
    catch (err) {
        console.log(err)
        res.status(500).json("Something went wrong.")
    }
})

router.get('/search', async (req, res) => {
    const { location, minbudget, maxbudget, rooms, rmove, progress } = req.query;
    const query = {};

    if (location) query.location = location;
    if (rooms) query.listing_type = parseInt(rooms);
    if (progress&&!rmove) query.listing_status = progress;
    if (!progress&&rmove) query.listing_status = rmove;
    if (minbudget && maxbudget) {
        query.price = { $gte: parseInt(minbudget), $lte: parseInt(maxbudget) };
    } else if (minbudget) {
        query.price = { $gte: parseInt(minbudget) };
    } else if (maxbudget) {
        query.price = { $lte: parseInt(maxbudget) };
    }

    try {
        const filteredProperties = await Listing.find(query);
        res.json(filteredProperties);
    } catch (err) {
        console.error('Error searching properties:', err);
        res.status(500).json({ error: 'An error occurred while searching properties' });
    }
});


module.exports = router