const passport = require ('passport');
const GoogleStrategy = require ('passport-google-oauth2').Strategy;
require ('dotenv').config ();
const User = require("./models/User")

passport.use (
  new GoogleStrategy (
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            const googleId = profile.id;
            const email = profile.emails[0].value; // User's email
    
            // Check if the user already exists in the database
            let existingUser = await User.findOne({ googleId: googleId });
    
            if (existingUser) {
                // User already exists, handle accordingly
                return done(null, existingUser);
            }
    
            // Create a new user with Google profile information
            const newUser = new User({
                googleId: googleId,
                email: email,
            });
    
            // Save the new user to the database
            await newUser.save();
    
            return done(null, newUser);
        } catch (error) {
            return done(error, null);
        }
    }
  )
);

passport.serializeUser ((user, done) => {
  done (null, user);
});

passport.deserializeUser ((user, done) => {
  done (null, user);
});