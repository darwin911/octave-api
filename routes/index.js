const router = require('express').Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const eventsRouter = require('./events');
const venueRouter = require('./venues');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/events', eventsRouter);
router.use('/venues', venueRouter);

module.exports = router;
