const connectToMngo = require("./db");
const express = require("express")
const cors = require("cors");
require ('./googleauth');
const passport = require ('passport');
const session = require ('express-session');
const JWT_SECRET = "Amanisagoodbo$y"
var jwt = require('jsonwebtoken');

connectToMngo();
const app = express()
const port = 5000;

app.use(express.json())
app.use(cors());


app.use (
    session ({
      secret: 'mysecret',
      resave: false,
      saveUninitialized: true,
      cookie: {secure: false},
    })
  );
  
  app.use (passport.initialize ());
  app.use (passport.session ());

//Available routes
app.use("/api/auth", require('./routes/auth'))
app.use(require('./routes/googleauthroutes'))



  
  app.use ('/auth/logout', (req, res) => {
    req.session.destroy ();
    res.send ('See you again!');
  });

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})