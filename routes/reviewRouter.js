const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getAllReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController.js');

const { protect, restrictTo } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

router
  .route('/:id')
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteReview);

module.exports = router;
