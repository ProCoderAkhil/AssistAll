const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://assistall.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// --- API Routes ---
// Example Test Route
app.get('/', (req, res) => {
    res.send("AssistAll API is running...");
});

// IMPORTANT: Add your actual routes here, e.g.:
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);


// Server Config
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Required for Vercel
module.exports = app;