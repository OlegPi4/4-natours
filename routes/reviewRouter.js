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

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('admin', 'user'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
