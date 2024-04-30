const express = require("express")
const router = express.Router()
const Listing = require("../models/Listing")
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser.js")

router.post("/create", fetchUser, [body('title', "Enter a valid title").isLength({ min: 3 }), body('description', "Description must be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const listing = await Listing.create({ ...req.body, posted_by: req.user.id })
        res.json(listing)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

router.get("/featured/:location", async (req, res) => {
    try {
        const properties = await Listing.find({ city: req.params.location }).sort({ date: 1 }).limit(4)
        res.status(200).json(properties)
    }
    catch (err) {
        res.status(500).json("Something went wrong.")
    }
})

router.get("/upcoming/:location", async (req, res) => {
    try {
        const properties = await Listing.find({ city: req.params.location }).sort({ date: 1 }).limit(6)
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

    if (location) query.city = location;
    if (rooms) query.configuration= parseInt(rooms);
    if (progress && !rmove) query.possession_date <new Date();
    if (!progress && rmove) query.possession_date <new Date();
    if (minbudget && maxbudget) {
        query.minPrice = { $gte: parseInt(minbudget), $lte: parseInt(maxbudget) };
        query.maxPrice = { $gte: parseInt(minbudget), $lte: parseInt(maxbudget) };
    } else if (minbudget) {
        query.minPrice = { $gte: parseInt(minbudget) };
    } else if (maxbudget) {
        query.maxPrice = { $lte: parseInt(maxbudget) };
    }

    try {
        const filteredProperties = await Listing.find(query);
        res.json(filteredProperties);
    } catch (err) {
        console.error('Error searching properties:', err);
        res.status(500).json({ error: 'An error occurred while searching properties' });
    }
});

router.get('/posted', fetchUser, async (req, res) => {

    try {
        const filteredProperties = await Listing.find({ posted_by: req.user.id });
        res.json(filteredProperties);
    } catch (err) {
        console.error('Error searching properties:', err);
        res.status(500).json({ error: 'An error occurred while searching properties' });
    }
});

router.delete('/property/delete/:propertyId',fetchUser, async (req, res) => {
    try {
        const { propertyId } = req.params;
        const property = await Listing.findByIdAndDelete(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put("/save", fetchUser, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate({ _id: req.user.id }, { $push: { saved_properties: req.body.listing_id } }, { new: true })
        res.json(user)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

router.post('/getsaved',fetchUser, async (req, res) => {
    const { tags } = req.body;

    try {
        const matchingItems = await Listing.find({ _id: { $in: tags } });
        res.status(200).json(matchingItems);
    } catch (error) {
        console.error('Error searching items by tags:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router