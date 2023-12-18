const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchUser = require("../middleware/fetchUser.js")
const JWT_SECRET = "Amanisagoodbo$y"
const passport = require ('passport');

function isLoggedIn (req, res, next) {
    req.user ? next () : res.sendStatus (401);
  }
  
router.get (
    '/auth/google',
    passport.authenticate ('google', {
      scope: ['email', 'profile'],
    })
  );
  
  router.get (
    '/auth/google/callback',
    passport.authenticate ('google', {
      successRedirect: '/auth/protected',
      failureRedirect: '/auth/google/failure',
    })
  );
  
  router.get ('/auth/google/failure', (req, res) => {
    res.send ('Something went wrong!');
  });
  
  router.get ('/auth/protected', isLoggedIn, (req, res) => {
    const authtoken = jwt.sign(req.user._id, JWT_SECRET)
    const success = true
    res.json({ success, authtoken })
  });

  module.exports = router