const router = require('express').Router();
const { default: axios } = require('axios');
const connection = require('../config/database');
const Venue = connection.models.Venue;
const API_KEY = process.env.TICKETMASTER_API_KEY;

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
      const resp = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/venues/${req.params.venueId}.json?apikey=${API_KEY}`
      );
      if (resp.data) {
        return res.send({ success: true, venue: resp.data });
      }
      return res.status(404).json({
        success: false,
        msg: 'Venue not found in database.',
        venueId: req.params.venueId,
      });
    }
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
});

router.post('/', async (req, res, next) => {
  try {
    const dbVenue = await Venue.findOne({
      where: { venueId: req.body.venueId },
    });
    console.log('Database Venue: ', dbVenue);
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
    console.error(error);
    return { success: false, error };
  }
});

module.exports = router;
