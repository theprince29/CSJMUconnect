const express = require('express');
const uploadpost = require("../controllers/dashbord")
const authController = require('../controllers/auth')

const router = express.Router();





router.get('/upload',authController.loggedIn, authController.renderDashboardupload);

router.get('/profile',authController.loggedIn,authController.renderDashboardprofile);
router.post('/upload',authController.loggedIn,uploadpost.postupload);

module.exports = router;