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

    const TM_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

    const resp = await axios.get(
      `${TM_BASE_URL}/events.json?classificationName=music&dmaId=${dmaId}&endDateTime=${threeMonthsFromNow}T00:00:00Z&apikey=${API_KEY}`
    );

    // console.log(resp.data._embedded.events.map((ev) => ev.dates.status.code));
    // let activeEvents = resp.data_embedded.events.filter(
    //   (ev) => ev.dates.code !== 'cancelled'
    // );
    // console.log(activeEvents);
    // let filtedEvents = resp.data._embedded.events.filter(
    //   (event) => event.dates.status.code !== 'cancelled'
    // );
    const events = resp.data._embedded.events;
    console.info(`Found ${events.length} events.`);
    return res.send(events);
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
