import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import rideRoutes from './routes/rides.js'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// --- CONNECT DB & AUTO-CLEAN ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // 👇 AUTOMATICALLY WIPE GHOST DATA ON STARTUP 👇
        try {
            // This deletes the 'requests' collection to prevent old loops
            await mongoose.connection.collection('requests').drop();
            console.log("🧹 DATABASE WIPED: All old requests deleted to prevent loops.");
        } catch (e) {
            console.log("✨ Database is already clean.");
        }
        // 👆👆👆

    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
    }
};
connectDB();

const rootDir = path.join(__dirname, '../');
const uploadDir = path.join(rootDir, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Debug Logger
app.use((req, res, next) => {
    console.log(`📡 Request: ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', rideRoutes); 

const potentialDistPaths = [
    path.join(rootDir, 'dist'),
    path.join(rootDir, 'client', 'dist')
];
let distPath = potentialDistPaths.find(p => fs.existsSync(p));

if (distPath) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
} else {
    app.get('*', (req, res) => res.send("API Running"));
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});