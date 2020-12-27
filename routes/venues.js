const router = require('express').Router();
const connection = require('../config/database');
const Venue = connection.models.Venue;

router.get('/', async (req, res, next) => {
  try {
    const venues = await Venue.find();
    return res.send(venues);
  } catch (error) {
    console.error(error);
    return error;
  }
});

router.post('/', async (req, res, next) => {
  try {
    const venue = await Venue.findOne({
      where: { venueId: req.body.venueId },
    });
    console.log('VENUE: ', venue);
    if (!venue) {
      // create venue
      const venueData = {
        venueId: req.body.venueId,
        name: req.body.venueName,
        url: req.body.url,
        city: req.body.city,
        state: req.body.state,
        address: req.body.address,
        image: req.body.image,
      };

      const newVenue = new Venue(venueData);
      await newVenue.save();

      return res.status(201).json({ success: true, venue: newVenue });
    } else {
      return res
        .status(409)
        .json({ success: false, msg: 'Venue already exists.' });
    }
  } catch (error) {
    res.status(500).send(error);
    throw error;
  }
});

module.exports = router;
