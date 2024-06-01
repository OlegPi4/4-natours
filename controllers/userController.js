const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Cheking route
  if (req.body.password || req.body.confirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // 2) Separate allowed fields for updating
  const filterBody = filterObj(req.body, 'name', 'email');

  // 3) Update user documents
  if (Object.keys(filterBody).length == 0) {
    return next(new AppError('These fields has not to changed !', 400));
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  console.log('in deleteMe');
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});

const createUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const getUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const updateUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const deleteUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  updateMe,
  deleteMe,
};
