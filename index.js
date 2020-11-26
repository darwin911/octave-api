const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

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

const authRouter = require('./routes/auth');

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ message: `Server is running on port: ${port}` });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
