const router = require('express').Router();
const connection = require('../config/database');
const Review = connection.models.Review;

router.get('/', async (req, res, next) => {
  try {
    const reviews = await Review.find();
    return res.send(reviews);
  } catch (error) {
    console.error(error);
    return error;
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findOne({ venueId: req.params.id });
    if (!review) {
      return res.status(404).json({ msg: 'Not found.', id: req.params.id });
    } else {
      return res.json({
        success: true,
        review,
        retrieved: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error(error);
    return error;
  }
});

router.post('/', async (req, res, next) => {
  try {
    const review = await Review.findOne({
      where: { reviewId: req.body.reviewId },
    });
    console.log('review: ', review);
    if (!review) {
      // create review
      const reviewData = {
        userId: req.body.userId,
        venueId: req.body.venueId,
        score: Number(req.body.score),
        text: req.body.text,
      };

      const newReview = new Review(reviewData);
      console.log(newReview);
      await newReview.save();

      return res.status(201).json({ success: true, review: newReview });
    } else {
      return res
        .status(409)
        .json({ success: false, msg: 'review already exists.' });
    }
  } catch (error) {
    res.status(500).send(error);
    throw error;
  }
});

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
