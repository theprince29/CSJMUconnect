const express = require('express');
const authController = require('../controllers/auth')
const forgotPasswordController = require('../controllers/forgotpassword');
const resetPasswordController = require('../controllers/resetpassword')
const router = express.Router();


// router.post('/register',authController.register);
router.get('/register', authController.showRegistrationForm);
router.post('/register', authController.registerUser);
router.get('/verify', authController.verifyEmail);
router.get('/reset-password/:token', forgotPasswordController.validateToken);
router.post('/reset-password/:token', resetPasswordController.updateNewPassword);
router.post('/dashbord',authController.login);
router.get('/dashbord',authController.loggedIn, authController.renderDashboard);
router.get('/forgot-password', forgotPasswordController.showForgotPasswordForm);
router.post('/forgot-password', forgotPasswordController.forgotPassword);
module.exports = router;