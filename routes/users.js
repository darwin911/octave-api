const router = require('express').Router();
const connection = require('../config/database');
const User = connection.models.User;

// Get All Users
router.get('/', async (req, res) => {
  try {
    let users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error);
  }
});

// Get User By Id
router.get('/:userId', async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.userId });
    if (user) {
      res.json({ user });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
