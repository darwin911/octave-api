const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
let routes = require('./routes');

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

require('./config/passport');

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

/**
 * -------------- DATABASE CONNECTION ----------------
 */

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('*** MongoDB database connection established successfully ***');
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
