const router = require('express').Router();
let User = require('../models/user.model');

// Get All Users
router.route('/users').get(async (req, res) => {
  try {
    let users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error);
  }
});

// Register
router.route('/register').post(async (req, res) => {
  try {
    console.log('/register');
    return '/register Route';
  } catch (error) {
    console.error(error);
  }
});

// Login
router.route('/login').post(async (req, res) => {
  try {
    console.log('/login');
    return '/login Route';
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
