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

// app.get('/', (req, res) => {
//     res.json({ 
//         message: 'Money Mate API Server', 
//         status: 'running',
//         timestamp: new Date().toISOString() 
//     });
// });

// app.get('/test', (req, res) => {
//     res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
// });

app.use('/icons', express.static(path.join(__dirname, 'public/icons')));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.post('/webhook', (req, res) => {
    console.log('🔔 Webhook received at:', new Date().toISOString());

    res.status(200).json({
        message: 'Webhook received successfully',
        timestamp: new Date().toISOString()
    });

    setTimeout(() => {
        console.log('Starting deployment...');
        exec('sh /var/www/money-mate-backend/deploy.sh', (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Deploy Error: ${error.message}`);
            } else {
                console.log(`✅ Deploy Success: ${stdout}`);
            }
        });
    }, 100);
});

app.listen(port, '127.0.0.1' ,  () => console.log(`Server is running on port ${port}`));