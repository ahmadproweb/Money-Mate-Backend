const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { exec } = require("child_process");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 1234;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

connectDb();

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Money Mate API Server', 
        status: 'running',
        timestamp: new Date().toISOString() 
    });
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Static files
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Webhook route
app.post('/webhook', (req, res) => {
    console.log('🔔 Webhook received at:', new Date().toISOString());
    console.log('📦 Request body:', req.body);
    
    exec('sh /var/www/money-mate-backend/deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Exec Error: ${error.message}`);
            return res.status(500).json({ error: 'Script execution failed', details: error.message });
        }
        if (stderr) {
            console.warn(`⚠️ Stderr: ${stderr}`);
        }
        console.log(`✅ Stdout: ${stdout}`);
        res.status(200).json({ message: 'Deploy executed successfully', output: stdout });
    });
});

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));