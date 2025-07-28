const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
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
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
connectDb();
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
