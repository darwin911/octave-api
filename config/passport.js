const passport = require('passport');
const { validPassword } = require('../lib/passwordUtils');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;

const customFields = {
  usernameField: 'uname',
  passwordField: 'pw',
};

/**
 * @method verifyCallback
 * @param {string} username
 * @param {string} password
 * @param {function} done
 */
const verifyCallback = (username, password, done) => {
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false); // No Error; No User; Returns 401
      }

      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err));
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  console.log('Serializing user...', user.id);
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
