const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AgentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: String,
        required: true // We'll handle country code format validation later if needed
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Hash password before saving
AgentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to match password
AgentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Agent = mongoose.model('Agent', AgentSchema);

module.exports = Agent; 