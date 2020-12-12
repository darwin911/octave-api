const express = require('express');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
let routes = require('./routes');
const connection = require('./config/database');
const cors = require('cors');

const MongoStore = require('connect-mongo')(session);

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
    },
  })
);

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

const authRouter = require('./routes');

app.use('/auth', authRouter);

/**
 * -------------- SERVER ----------------
 */

app.get('/', (req, res) => {
  res.json({ message: `Server is running on port: ${port}` });
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
