const router = require('express').Router();
const moment = require('moment');
const axios = require('axios');
const API_KEY = process.env.TICKETMASTER_API_KEY;
///////////////// TICKETMASTER API //////////////////

// Show all events

router.get('/:dmaId', async (req, res, next) => {
  try {
    const dmaId = req.params.dmaId || '345'; // Defaults to 345: New York
    let now = moment();
    const time = now.add(3, 'months');
    const threeMonthsFromNow = moment(time).format('YYYY-MM-DD');

    const resp = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=${dmaId}&endDateTime=${threeMonthsFromNow}T00:00:00Z&size=70&apikey=${API_KEY}`
    );
    return res.send(resp.data._embedded.events);
  } catch (error) {
    return error;
  }
});

router.get('/id/:eventId', async (req, res, next) => {
  try {
    const resp = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events/${req.params.eventId}.json?apikey=${API_KEY}`
    );
    return res.send(resp.data);
  } catch (error) {
    return error;
  }
});

module.exports = router;
