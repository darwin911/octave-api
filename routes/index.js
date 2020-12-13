const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../lib/passwordUtils').generatePassword;
const connection = require('../config/database');
const isAuth = require('./authMiddleware').isAuth;
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
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: 'login-success',
  })
);

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

router.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the protected route.');
  if (req.isAuthenticated()) {
    res.send(`
    <h1>You are authenticated</h1>
    <p><a href="/logout">Logout and reload.</a></p>
    `);
  } else {
    res.send(`
    <h1>You are not authenticad.</h1>
    <p><a href="/login">Login</a></p>
    `);
  }
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
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});

module.exports = router;
