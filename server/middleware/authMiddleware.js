const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // We will use the User model to find the user

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format: "Bearer TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID from the token payload and attach to the request object (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            // Proceed to the next middleware or route handler
            next();

        } catch (error) {
            console.error('Not authorized, token failed:', error.message);
            res.status(401); // 401 Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401); // 401 Unauthorized
        throw new Error('Not authorized, no token');
    }
});

// We can add an admin middleware later if we want to restrict certain actions to only admin users
// const admin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         next();
//     } else {
//         res.status(403); // 403 Forbidden
//         throw new Error('Not authorized as an admin');
//     }
// };


module.exports = { protect }; 