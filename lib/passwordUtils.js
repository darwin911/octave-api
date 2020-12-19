const crypto = require('crypto');

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

module.exports.validPassword = validPassword;
module.exports.generatePassword = generatePassword;
