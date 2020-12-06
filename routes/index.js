const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user.model');

// Get All Users
router.route('/users').get(async (req, res) => {
  try {
    let users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error);
  }
});

/**
 * -------------- POST ROUTES ----------------
 */

// TODO
router.post('/login', (req, res, next) => {});

// TODO
router.post('/register', (req, res, next) => {});

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

module.exports = router;
