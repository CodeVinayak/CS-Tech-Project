const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController'); // Import loginUser and registerUser

// @route POST /api/auth/register
// @desc Register user
// @access Public
router.post('/register', registerUser); // Use the registerUser controller function

// @route POST /api/auth/login
// @desc Login user
// @access Public
router.post('/login', loginUser); // Use the loginUser controller function

module.exports = router; 