const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../lib/passwordUtils').generatePassword;
const validPassword = require('../lib/passwordUtils').validPassword;
const connection = require('../config/database');
// const isAuth = require('./authMiddleware').isAuth;
const User = connection.models.User;

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
router.post('/login', (req, res, next) => {
  User.findById({ email: req.body.email }).then((user) => {
    if (!user) {
      //
    }

    const isValid = validPassword(req.body.password, user.hash, user.salt);
  });
});

// TODO
router.post('/auth/register', async (req, res, next) => {
  const { salt, hash } = generatePassword(req.body.pw);

  const data = {
    username: req.body.uname,
    email: req.body.email,
    hash: hash,
    salt: salt,
  };

  try {
    const emailInUse = await User.findOne({ email: req.body.email });

    if (!emailInUse) {
      const newUser = await new User(data);
      await newUser.save();
      res.status(201).send(newUser);
    } else {
      res.status(409).json({ msg: 'Email is already in use.', error: 409 });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: 'Something went wrong', error, errorCode: 500 });
  }
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/protected-route');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
  Enter Username:<br><input type="text" name="uname">\
  <br>Enter Password:<br><input type="password" name="pw">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="uname">\
                  <br>Enter Password:<br><input type="password" name="pw">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get('/login-success', (req, res, next) => {
  console.log(req.body);
  try {
    // User.findOne({
    //   where: {
    //     email: req.body.email,
    //   },
    // });
    res.json({
      msg: 'You successfully logged in.',
      redirect: '/home',
    });
  } catch (error) {
    console.error(error);
  }
});

router.get('/login-failure', (req, res, next) => {
  res.status(401).json({
    msg: 'You entered the wrong password.',
  });
});

module.exports = router;
