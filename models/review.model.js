const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  venueId: { type: String, required: true },
  score: Number,
  text: String,
});

// Expose the connection
module.exports = ReviewSchema;
