const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const fs = require('fs');
const path = require('path');

// Define the log file path
const logFilePath = path.join(__dirname, '..' , 'registration_debug.log');

// Helper function to log messages to a file
const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `${timestamp}: ${message}\n`);
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' }); // 401 Unauthorized
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    logToFile('Register user function entered');
    const { name, email, password } = req.body;
    logToFile(`Request Body: ${JSON.stringify({ name, email, password })}`);

    let userExists;
    try {
        // Check if user already exists
        userExists = await User.findOne({ email });
        logToFile(`User exists check result: ${userExists ? JSON.stringify(userExists) : 'null'}`);
    } catch (error) {
        logToFile(`Error during User.findOne: ${error.message || error}`);
        // It might be better to send a specific error response here too,
        // but for now, we just log and let it proceed to the next check.
    }

    if (userExists) {
        logToFile('User already exists, sending 400 response');
        res.status(400).json({ message: 'User already exists' }); // 400 Bad Request
        return; // Stop execution
    }

    let user;
    try {
        // Create the new user
        logToFile('Attempting to create new user');
        user = await User.create({
            name,
            email,
            password,
        });
        logToFile(`User create result: ${user ? JSON.stringify(user) : 'null'}`);
    } catch (error) {
        logToFile(`Error during User.create: ${error.message || error}`);
        res.status(500).json({ message: 'User creation failed' }); // Send a server error response
        return; // Stop execution
    }


    if (user) {
        logToFile('User created successfully, preparing 201 response');
        res.status(201).json({ // 201 Created
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        logToFile('Invalid user data after create, sending 400 response');
        // This case should ideally not be reached if create doesn't throw, but as a fallback:
        res.status(400).json({ message: 'Invalid user data' }); // 400 Bad Request
    }
});

module.exports = {
  loginUser,
  registerUser,
}; 