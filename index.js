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
const port = process.env.PORT || 1111;

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
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.post('/webhook', (req, res) => {
    exec('sh /var/www/money-mate-backend/deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.sendStatus(500);
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.sendStatus(500);
        }
        console.log(`Stdout: ${stdout}`);
        res.sendStatus(200);
    });
});

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
