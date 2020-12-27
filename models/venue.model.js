const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  venueId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  url: String,
  city: String,
  state: String,
  address: String,
  image: Object,
});

// Expose the connection
module.exports = VenueSchema;
