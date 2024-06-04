const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../controllers/reviewController.js');

const { protect, restrictTo } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteReview)
  .patch(protect, updateReview);

module.exports = router;
