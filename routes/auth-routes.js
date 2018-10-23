const router = require('express').Router()
const passport = require('passport')

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user })
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.status(401).redirect('/');
});

// auth with google+
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile')
  });

module.exports = router
