const router = require('express').Router();
const moment = require('moment');
const axios = require('axios');

const API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com';
const TM_URL = new URL('/discovery/v2/events.json?', BASE_URL);

///////////////// TICKETMASTER API //////////////////

// Show all events
router.get('/', async (req, res) => {
  try {
    const searchParams = new URLSearchParams({
      ...req.query,
      size: 200,
      apikey: API_KEY,
    }).toString();
    TM_URL.search = searchParams;

    const data = await getEntireEventList();

    if (data) {
      console.log('Sending you back:', data._embedded.events.length);
      return res.send(data._embedded.events);
    }
  } catch (error) {
    console.log(error && error.response);
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

const getEvents = async (nextURL, eventList) => {
  console.log('getEvents');
  if (nextURL) {
    const url = new URL(nextURL, BASE_URL);
    const key = String(API_KEY);
    url.searchParams.append('apikey', key);
    const resp = await axios.get(url.href);
    resp.data._embedded.events = eventList.concat(
      resp.data._embedded.events.map(
        ({ id, dates, images, name, priceRanges, url, ...rest }) => {
          let venues = rest._embedded.venues;
          return {
            id,
            dates,
            images,
            name,
            priceRanges,
            url,
            venues,
          };
        }
      )
    );
    console.log(resp.data._embedded.events.length);
    console.log('total:', resp.data.page.totalElements);
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

module.exports = router;
