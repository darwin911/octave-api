const router = require('express').Router();
const moment = require('moment');
const axios = require('axios');
const API_KEY = process.env.TICKETMASTER_API_KEY;
///////////////// TICKETMASTER API //////////////////

// Show all events

router.get('/:dmaId', async (req, res, next) => {
  console.time('getEvents');

  try {
    const dmaId = req.params.dmaId || '345'; // Defaults to 345: New York
    let now = moment();
    const time = now.add(3, 'months');
    const threeMonthsFromNow = moment(time).format('YYYY-MM-DD');

    const BASE_URL = 'https://app.ticketmaster.com';
    const classification = 'classificationName=music';
    const sizeVal = '200';
    const URL = `${BASE_URL}/discovery/v2/events.json?${classification}&size=${sizeVal}&dmaId=${dmaId}&endDateTime=${threeMonthsFromNow}T00:00:00Z&apikey=${API_KEY}`;

    const resp = await axios.get(URL);

    const events = resp.data._embedded.events;
    console.info(`Found ${events.length} events.`);
    const {
      page: { size, totalElements },
      _links,
    } = resp.data;
    console.log({ size, totalElements });
    if (size < totalElements) {
      const nextURL = `${BASE_URL}${_links.next.href}&apikey=${API_KEY}`;
      console.log('fetching more events...');
      console.log({ nextURL });
      const nextData = await axios.get(nextURL);

      const nextEvents = nextData.data._embedded.events;
      console.log(`\nNext Events:\n`, nextEvents.length, '\n');

      const allEvents = [...events, ...nextEvents];

      console.log(`Found ${allEvents.length} in All events.`);
      console.timeEnd('getEvents');
      return res.send(allEvents);
    }
    console.timeEnd('getEvents');
    return res.send(events);
  } catch (error) {
    console.log(error);
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
