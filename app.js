const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const passport = require('passport')
const cookieSession = require('cookie-session')


const app = express();

// Initialize passport and session.
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))
app.use(passport.initialize())
app.use(passport.session())

// set view engine
app.set('view engine', 'ejs');

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, (err) => {
    if (err) {
        console.log("Cannot connect to MongoDB ", err)
        process.exit(1)
    } 
    console.log('Connected to MongoDB')
})

// set up routes
app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);


// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});
