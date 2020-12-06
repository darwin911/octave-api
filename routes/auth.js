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
router.route('/register').get(async (req, res) => {
  try {
    res.send('/register');
  } catch (error) {
    console.error(error);
  }
});
// Login
router.route('/login').get(async (req, res) => {
  try {
    res.send('/login');
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
