const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController.js');

const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('./../controllers/authController.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router.get('/me', protect, getMe, getUser);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router
  .route('/:id')
  .get(getUser)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateUser)
  .delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
