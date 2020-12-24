const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const connection = require('./database');
const path = require('path');
const fs = require('fs');
const User = connection.models.User;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

/**
 * @method verifyCallback
 * @param {object} jwt_payload
 * @param {function} done
 */
const verifyCallback = (jwt_payload, done) => {
  console.log(jwt_payload);

  User.findOne({ _id: jwt_payload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(options, verifyCallback));
};
