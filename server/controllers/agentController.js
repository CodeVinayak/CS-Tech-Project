const asyncHandler = require('express-async-handler');
const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private (Admin only - we'll add auth middleware later)
const createAgent = asyncHandler(async (req, res) => {
    const { name, email, mobileNumber, password } = req.body;

    console.log('Received data for new agent:', req.body);

    // Basic validation
    if (!name || !email || !mobileNumber || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // Check if agent already exists by email
    const agentExists = await Agent.findOne({ email });

    if (agentExists) {
        res.status(400);
        throw new Error('Agent with this email already exists');
    }

    // Create the new agent
    const agent = await Agent.create({
        name,
        email,
        mobileNumber,
        password, // Password will be hashed by the pre-save middleware
    });

    if (agent) {
        res.status(201).json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            mobileNumber: agent.mobileNumber,
            // We don't return the password here
        });
    } else {
        res.status(400);
        throw new Error('Invalid agent data');
    }
});

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private (Admin only - we'll add auth middleware later)
const getAgents = asyncHandler(async (req, res) => {
    const agents = await Agent.find({}); // Fetch all agents
    res.json(agents); // Send agents as JSON response
});

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Private (Admin only - we'll add auth middleware later)
const getAgentById = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        res.json(agent);
    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});

// @desc    Update agent by ID
// @route   PUT /api/agents/:id
// @access  Private (Admin only - we'll add auth middleware later)
const updateAgent = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        // Update agent properties
        agent.name = req.body.name || agent.name;
        agent.email = req.body.email || agent.email;
        agent.mobileNumber = req.body.mobileNumber || agent.mobileNumber;

        // Handle password update if provided
        if (req.body.password) {
             // Basic validation for new password length if needed
             // if (req.body.password.length < 6) {
             //     res.status(400);
             //     throw new Error('Password must be at least 6 characters');
             // }
            const salt = await bcrypt.genSalt(10);
            agent.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedAgent = await agent.save();

        res.json({
            _id: updatedAgent._id,
            name: updatedAgent.name,
            email: updatedAgent.email,
            mobileNumber: updatedAgent.mobileNumber,
            // Don't return the password here
        });

    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});

// @desc    Delete agent by ID
// @route   DELETE /api/agents/:id
// @access  Private (Admin only - we'll add auth middleware later)
const deleteAgent = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        await Agent.deleteOne({ _id: agent._id });
        res.json({ message: 'Agent removed' });
    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});

// @desc    Get total count of agents
// @route   GET /api/agents/count
// @access  Private (Admin only - we'll add auth middleware later)
const getAgentCount = asyncHandler(async (req, res) => {
    const count = await Agent.countDocuments();
    res.json({ count });
});

module.exports = {
    createAgent,
    getAgents,
    getAgentById,
    updateAgent,
    deleteAgent,
    getAgentCount,
}; 