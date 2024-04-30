const express = require("express")
const router = express.Router()
const Agent = require("../models/Agent")
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser.js");
const Listing = require("../models/Listing.js");

router.post("/create/agent", fetchUser, async (req, res) => {
    try {
        const agent = await Agent.create({ ...req.body })
        res.json(agent)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

router.get('/agents', async (req, res) => {

    try {
        const agents = await Agent.find();
        res.json(agents);
    } catch (err) {
        console.error('Error searching agents:', err);
        res.status(500).json({ error: 'An error occurred while searching agents' });
    }
});

router.get('/agents/assigned/:_id', async (req, res) => {
    console.log(req.params._id)
    try {
        const properties = await Listing.find({agent:req.params._id});
        res.json(properties);
    } catch (err) {
        console.error('Error searching properties:', err);
        res.status(500).json({ error: 'An error occurred while searching properties' });
    }
});

module.exports = router