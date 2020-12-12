const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../lib/passwordUtils').generatePassword;
const connection = require('../config/database');
const User = connection.models.User;
console.log('models:', connection.models);

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
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.send({ msg: '/login' });
});

// TODO
router.post('/register', (req, res, next) => {
  const { salt, hash } = generatePassword(req.body.pw);

  const newUser = new User({
    username: req.body.uname,
    hash: hash,
    salt: salt,
  });

  newUser.save().then((user) => {
    console.log(user);
    res.send({ user });
  });
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

module.exports = router;
