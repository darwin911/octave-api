const router = require('express').Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const eventsRouter = require('./events');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/events', eventsRouter);

module.exports = router;
