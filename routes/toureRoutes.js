// tourRouter.js
const express = require('express');
const router = express.Router();

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

const { protect } = require('./../controllers/authController');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/tour-stats').get(getTourStats);
router.route('/').get(protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateToure).delete(deleteToure);

module.exports = router;
