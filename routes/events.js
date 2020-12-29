const router = require('express').Router();
const moment = require('moment');
const axios = require('axios');

const API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com';
const TM_URL = new URL('/discovery/v2/events.json?', BASE_URL);

///////////////// TICKETMASTER API //////////////////

const getEvents = async (nextURL, eventList) => {
  console.log('getEvents');
  if (nextURL) {
    const url = new URL(nextURL, BASE_URL);
    const key = String(API_KEY);
    url.searchParams.append('apikey', key);
    const resp = await axios.get(url.href);
    resp.data._embedded.events = eventList.concat(
      resp.data._embedded.events.map(
        ({ id, dates, images, name, priceRanges, url, _embedded }) => ({
          id,
          dates,
          images,
          name,
          priceRanges,
          url,
          _embedded: {
            venues: _embedded.venues,
          },
        })
      )
    );
    console.log(resp.data._embedded.events.length);
    return resp.data;
  } else {
    const resp = await axios.get(TM_URL.href);
    return resp.data;
  }
};

const getEntireEventList = async (nextURL = '', prevEvents) => {
  const results = await getEvents(nextURL, prevEvents);
  const next = results._links.next && results._links.next.href;
  console.log('Retreiving data from API for page : ' + results.page.number);

  if (next) {
    console.log('calling', next);
    return await getEntireEventList(next, results._embedded.events);
  } else {
    console.log('last time around!');
    return results;
  }
};

// Show all events
router.get('/:dmaId', async (req, res, next) => {
  console.time('getEvents');
  try {
    const { dmaId = 345 } = req.params; // Defaults to 345: New York

    const searchParams = new URLSearchParams({
      classificationName: 'music',
      size: 200,
      dmaId: dmaId,
      apikey: API_KEY,
    }).toString();
    TM_URL.search = searchParams;

    const data = await getEntireEventList();
    console.log('We made it paste the data fetching!. Hopefully.');

    return res.send(data._embedded.events);
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
