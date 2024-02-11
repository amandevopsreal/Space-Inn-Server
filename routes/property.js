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

router.post("/upcoming",fetchUser,async(req,res)=>{
    try{
        const properties=await Listing.find({location:req.body.location,listing_status:"upcoming"}).sort({date:1}).limit(6)
        res.status(200).json(properties)
    }
    catch(err){
        res.status(500).json("Something went wrong.")
    }
})



module.exports = router