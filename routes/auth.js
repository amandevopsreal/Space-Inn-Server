const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchUser = require("../middleware/fetchUser.js")
const JWT_SECRET = "Amanisagoodbo$y"
const { OAuth2Client } = require("google-auth-library")
const axios = require('axios');

const client = new OAuth2Client("725204124376-92pnl02prvigj9548anq9mb4fdc4jjvf.apps.googleusercontent.com")


router.post("/createuser", [body('email', "Enter a valid email").isEmail(), body('password', "Password must be atleast 5 characters").isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            password: secPass,
            email: req.body.email
        })
        const data = {
            id: user.id
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})


router.post("/login", [body('email', "Enter a valid email").isEmail(), body('password', "Password cannot be blank").exists()
], async (req, res) => {

    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }
        const data = {
            id: user.id
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})


router.post('/getUser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

router.post('/googlelogin', async (req, res) => {
    let success = false
    const { access_token } = req.body
    const profile = axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/json",
                },
            }
        )
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            console.error(error.message)
            res.status(500).send("Internal server error axios")
        });
    profile.then(async (response) => {
        const { verified_email, email, id } = response
        if (verified_email) {
            try {
                let user = await User.findOne({ email })
                if (user) {
                    const data = {
                        id: user.id
                    }
                    const authtoken = jwt.sign(data, JWT_SECRET)
                    success = true
                    res.json({ success, authtoken })
                }
                else {
                    user = await User.create({
                        googleId: id,
                        email
                    })
                    const data = {
                        id: user.id
                    }
                    const authtoken = jwt.sign(data, JWT_SECRET)
                    success = true
                    res.json({ success, authtoken })
                }
            }
            catch (error) {
                console.error(error.message)
                res.status(500).send("Internal server error")
            }
        }
    })


})

module.exports = router