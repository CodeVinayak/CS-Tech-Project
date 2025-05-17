const express = require('express');
const router = express.Router();
const { uploadList, getDistributedLists, getDistributedListCount, getListItemCount } = require('../controllers/listController'); // Import new controller functions
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload and distribute list from file
// @route   POST /api/lists/upload
// @access  Private (Admin only - requires auth middleware)
router.post('/upload', protect, upload, uploadList);

// @desc    Get all distributed lists (or filtered by agent/upload batch later)
// @route   GET /api/lists/distributed
// @access  Private (Admin only - requires auth middleware)
router.get('/distributed', protect, getDistributedLists);

// @desc    Get total count of distributed lists
// @route   GET /api/lists/count/distributed
// @access  Private (Admin only - requires auth middleware)
router.get('/count/distributed', protect, getDistributedListCount);

// @desc    Get total count of list items
// @route   GET /api/lists/count/items
// @access  Private (Admin only - requires auth middleware)
router.get('/count/items', protect, getListItemCount);

module.exports = router; 