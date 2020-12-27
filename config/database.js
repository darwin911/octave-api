const mongoose = require('mongoose');
const ReviewSchema = require('../models/review.model');
const UserSchema = require('../models/user.model');
const VenueSchema = require('../models/venue.model');
require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection.once('open', () => {
  console.log('*** MongoDB database connection established successfully ***');
});

const User = connection.model('User', UserSchema);
const Venue = connection.model('Venue', VenueSchema);
const Review = connection.model('Review', ReviewSchema);

// Expose the connection
module.exports = connection;
