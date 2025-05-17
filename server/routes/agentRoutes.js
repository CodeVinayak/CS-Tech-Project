const express = require('express');
const router = express.Router();
const {
    createAgent,
    getAgents,
    getAgentById,
    updateAgent,
    deleteAgent,
    getAgentCount,
} = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Apply protect middleware to all agent routes
router.route('/').post(protect, createAgent).get(protect, getAgents);

// New route to get the total count of agents
router.route('/count').get(protect, getAgentCount);

router
    .route('/:id')
    .get(protect, getAgentById)
    .put(protect, updateAgent)
    .delete(protect, deleteAgent);

module.exports = router; 