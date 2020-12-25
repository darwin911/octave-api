const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../lib/utils').generatePassword;
const validPassword = require('../lib/utils').validPassword;
const connection = require('../config/database');
const utils = require('../lib/utils');
// const isAuth = require('./authMiddleware').isAuth;
const User = connection.models.User;

router.get(
  '/auth/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({ success: true, msg: 'You are authorized!' });
  }
);

// Get All Users
router.route('/users').get(async (req, res) => {
  try {
    let users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error);
  }
});

// Get User By Id
router.route('/users/:userId').get(async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.userId });
    if (user) {
      res.json({ user });
    }
  } catch (error) {
    console.error(error);
  }
});

/**
 * -------------- POST ROUTES ----------------
 */

// TODO
router.post('/auth/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: 'Could not find user.' });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        const cleanUser = utils.cleanUser(user);

        res
          .status(200)
          .json({ success: true, user: cleanUser, token: tokenObject.token });
      } else {
        res.status(401).json({
          success: false,
          msg: 'Sorry, it looks like you have entered invalid credentials.',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// TODO
router.post('/auth/register', async (req, res, next) => {
  const { salt, hash } = generatePassword(req.body.password);

  const data = {
    username: req.body.username,
    email: req.body.email,
    hash: hash,
    salt: salt,
  };

  try {
    const emailInUse = await User.findOne({ email: req.body.email });

    if (!emailInUse) {
      const newUser = await new User(data);
      await newUser.save();
      const jwt = utils.issueJWT(newUser);
      const cleanUser = utils.cleanUser(newUser);
      res.status(201).send({
        success: true,
        user: cleanUser,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
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
