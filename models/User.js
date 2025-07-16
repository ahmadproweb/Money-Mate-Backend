const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: {
    type: String,
    enum: ["essentials", "flexible", "non-essentials"]
  },
  createdAt: { type: Date, default: Date.now }
});
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  codeExpires: Date,
  forgotPasswordAttempts: {
    count: { type: Number, default: 0 },
    date: { type: Date, default: null }
  },
  resetPasswordAttempts: {
    count: { type: Number, default: 0 },
    date: { type: Date, default: null }
  },
  changePasswordAttempts: {
    count: { type: Number, default: 0 },
    date: { type: Date, default: null }
  },
  totalIncome: { type: Number, default: 0 },
  expenses: [expenseSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
