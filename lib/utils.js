// https://github.com/zachgoll/express-jwt-authentication-starter/blob/final/lib/utils.js

const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
// const LOCAL_PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

/**
 * @typedef {Object} PasswordDigest – PasswordDigest
 * @property {string} salt - 32 bit hex salt
 * @property {string} hash
 */

/**
 * Generates password salt and hash from string.
 * @method genPassword
 * @param {string} password password string.
 * @returns {PasswordDigest} Password Digest.
 * @example { salt: salt, hash: genHash }
 */

function generatePassword(password) {
  let salt = crypto.randomBytes(32).toString('hex');
  let genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return { salt, hash: genHash };
}

/**
 * Checks if given password matches database hash and salt.
 * @method validPassword
 * @param {string} password
 * @param {string} hash
 * @param {string} salt
 * @returns {boolean} Boolean
 */
function validPassword(password, hash, salt) {
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

/**
 * @method issueJWT
 * @param {object} user
 */
function issueJWT(user) {
  const _id = user._id;

  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.PRIV_KEY.replace(/\\n/g, '\n'),
    {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    }
  );

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
}

/**
 * @method cleanUser Cleans user object for Front-end
 * @param {object} user
 * @returns {object} user object without properties that should not be required on the front-end.
 */

function cleanUser(user) {
  user.__v = undefined;
  user.hash = undefined;
  user.salt = undefined;
  return user;
}

module.exports.validPassword = validPassword;
module.exports.generatePassword = generatePassword;
module.exports.issueJWT = issueJWT;
module.exports.cleanUser = cleanUser;
