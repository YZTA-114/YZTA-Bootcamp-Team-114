const express = require('express');
const {
  register,
  login,
  getMe,
  uploadAvatar,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
  deleteAvatar,
} = require("../../controllers/auth/authController");

const router = express.Router();

const { protect } = require('../../middleware/auth');
const photoUpload = require('../../middleware/photoUpload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.delete('/deleteavatar', protect, deleteAvatar);
router.put('/uploadavatar', protect, photoUpload("file"), uploadAvatar);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', logout);


module.exports = router;