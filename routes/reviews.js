const router = require('express').Router();
const connection = require('../config/database');
const isEmpty = require('lodash');
const Review = connection.models.Review;

// Get All Reviews
router.get('/', async (req, res, next) => {
  try {
    const reviews = await Review.find();
    console.log(`Found ${reviews.length} reviews.`);
    return res.send({ reviews });
  } catch (error) {
    console.error(error);
    return error;
  }
});

// Get Review By Id
router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findOne({ venueId: req.params.id });
    if (!review) {
      return res.status(404).json({ msg: 'Not found.', id: req.params.id });
    } else {
      return res.json({
        success: true,
        review,
      });
    }
  } catch (error) {
    console.error(error);
    return error;
  }
});

// Get All Reviews for Venue by VenueId
router.get('/venues/:venueId', async (req, res, next) => {
  try {
    console.log('params', req.params);
    const reviews = await Review.find({ venueId: req.params.venueId });
    let count = reviews.length;
    console.log({ count: count });
    if (!count) {
      console.log('No reviews found.', `!count: ${!count}`);
      return res.status(404).json({
        sucess: false,
        msg: 'No reviews found.',
        reviews: [],
      });
    } else {
      console.log(`${count} reviews found.`);
      return res.json({
        success: true,
        reviews,
        count: reviews.length,
      });
    }
  } catch (error) {
    console.error(error);
    return error;
  }
});

// POST - "/reviews/venues"
router.post('/venues', async (req, res, next) => {
  const { userId, venueId } = req.body;
  try {
    const venueReview = await Review.findOne({
      venueId: venueId,
      userId: userId,
    });

    if (!venueReview) {
      console.log('did not find any reviews in database for venue/user');
      // create review
      const reviewData = {
        userId: userId,
        venueId: venueId,
        score: Number(req.body.score),
        text: req.body.text,
      };

      const newReview = new Review(reviewData);
      await newReview.save();
      console.log(newReview, '\nReview created!\n');

      return res.status(201).json({ success: true, review: newReview });
    } else {
      console.log('We found this review, so you will get a 409', venueReview);
      return res.status(409).json({
        success: false,
        msg: 'This venue has already been reviewed by this user.',
        previousReview: venueReview,
      });
    }
  } catch (error) {
    res.status(500).send(error);
    throw error;
  }
});

// DELETE Review by Id
router.delete('/:id', async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    console.log('review delete response: ', review);
    return res
      .status(200)
      .json({ msg: `Review ${req.params.id} has been successfully delted.` });
  } catch (error) {
    res.status(500).send(error);
    throw error;
  }
});

module.exports = router;
