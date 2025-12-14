import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 1. Setup Path Variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 2. DEBUG: Find where the 'dist' folder is
// We check common locations: root/dist or root/client/dist
const rootDir = path.join(__dirname, '../'); 
const potentialDistPaths = [
    path.join(rootDir, 'dist'),
    path.join(rootDir, 'client', 'dist')
];

let distPath = potentialDistPaths.find(p => fs.existsSync(p));

// Log the result to Render Console
if (distPath) {
    console.log(`✅ SUCCESS: Found build folder at: ${distPath}`);
} else {
    console.error(`❌ ERROR: Could not find 'dist' folder! Checked:`);
    potentialDistPaths.forEach(p => console.error(` - ${p}`));
    // List files in root to help debugging
    console.error("Files in root directory:", fs.readdirSync(rootDir));
}

// 3. Setup Image Uploads
const uploadDir = path.join(rootDir, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 4. Serve Files
// Serve uploaded images
app.use('/uploads', express.static(uploadDir));

// Serve React App (if found)
if (distPath) {
    app.use(express.static(distPath));
}

// 5. API Routes
app.post('/upload', upload.single('profilePic'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// 6. Catch-All (Send index.html for any other request)
app.get('*', (req, res) => {
    if (distPath) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        res.status(500).send("Server Error: React build file (index.html) not found. Check server logs.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});