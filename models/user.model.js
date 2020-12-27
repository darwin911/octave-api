const mongoose = require('mongoose');

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hash: String,
  salt: String,
  admin: Boolean,
});

// Expose the connection
module.exports = UserSchema;
