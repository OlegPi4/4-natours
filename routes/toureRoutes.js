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
  getToursWithin,
  getDistances,
} = require('../controllers/tourController.js');

const { protect, restrictTo } = require('./../controllers/authController');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
router.route('/tour-stats').get(getTourStats);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateToure)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteToure);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
