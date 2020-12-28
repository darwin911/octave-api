const router = require('express').Router();
const connection = require('../config/database');
const Venue = connection.models.Venue;

/**
 * Get All Venues
 */

router.get('/', async (req, res, next) => {
  try {
    const venues = await Venue.find();
    return res.send(venues);
  } catch (error) {
    console.error(error);
    return error;
  }
});

/**
 * Get Venue by VenueId
 */

router.get('/:venueId', async (req, res, next) => {
  try {
    const venue = await Venue.findOne({ venueId: req.params.venueId });
    if (venue) {
      return res.send(venue);
    } else {
      return res.status(404).json({ msg: 'Venue not found in database.' });
    }
  } catch (error) {
    console.error(error);
    return error;
  }
});

router.post('/', async (req, res, next) => {
  try {
    const dbVenue = await Venue.findOne({
      where: { venueId: req.body.venueId },
    });
    console.log('VENUE: ', dbVenue);
    if (!dbVenue) {
      // create venue
      const venueData = {
        venueId: req.body.venueId,
        name: req.body.name,
        url: req.body.url,
        city: req.body.city,
        state: req.body.state,
        address: req.body.address,
        image: req.body.image,
      };

      const newVenue = new Venue(venueData);
      await newVenue.save();

      console.info({ success: true, venue: newVenue });

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
