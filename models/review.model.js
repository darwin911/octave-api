const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  text: String,
  score: String,
  userId: String,
  venueId: String,
});

// Expose the connection
module.exports = ReviewSchema;
