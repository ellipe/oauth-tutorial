const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys  = require('./keys')
const User = require('../models/Users')


passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        User.findOne({googleId: profile.id}, (err, user) => {
            if (err) {
                return done(err)
            }
            if (user) {
                done(null, user)
            } else {
                new User({
                    googleId: profile.id,
                    username: profile.displayName
                }).save().then((newUser)=> {
                    done(null, newUser)
                }).catch((err) => {
                    console.log("Cannot create the new user.")
                    return done(err)
                })
            }
        })
    })
);
