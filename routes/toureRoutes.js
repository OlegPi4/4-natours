// tourRouter.js
const express = require('express');
const router = express.Router();

const reviewRouter = require('./reviewRouter.js');

const {
  getAllTours,
  createTour,
  getTour,
  updateToure,
  deleteToure,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController.js');

const { protect, restrictTo } = require('./../controllers/authController');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/tour-stats').get(getTourStats);
router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin'), updateToure)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteToure);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
