const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;

const connectDb = () => {
  return mongoose
    .connect(MONGO_DB_URL, {
      dbName: "money-mate",
    })
    .then(() => {
      console.log(`✅ Database connected: ${mongoose.connection.host}`);
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1); 
    });
};

module.exports = connectDb;
