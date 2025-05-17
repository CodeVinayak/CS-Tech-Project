const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes'); // Import Agent Routes
const listRoutes = require('./routes/listRoutes'); // Import List Routes

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Log incoming requests to auth routes
app.use('/api/auth', (req, res, next) => {
    console.log(`Incoming auth request: ${req.method} ${req.originalUrl}`);
    next();
}, authRoutes);

// Use Agent Routes
app.use('/api/agents', agentRoutes); // Use Agent Routes

// Use List Routes
app.use('/api/lists', listRoutes); // Use List Routes

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true, // These options are no longer needed in recent Mongoose versions
    // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic error handler middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 