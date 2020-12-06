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

module.exports = router;
