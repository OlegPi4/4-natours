const Tour = require('../models/tourModel');
const AppError = require('./../utils/appErrors');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
  // 1) get tours data from collection
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tout with this name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
};
