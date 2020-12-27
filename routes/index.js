const router = require('express').Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const eventsRouter = require('./events');
const venueRouter = require('./venues');
const reviewRouter = require('./reviews');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/events', eventsRouter);
router.use('/venues', venueRouter);
router.use('/reviews', reviewRouter);

module.exports = router;
