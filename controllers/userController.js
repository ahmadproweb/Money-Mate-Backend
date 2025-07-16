const User = require("../models/User");
const bcrypt = require("bcryptjs");
const checkLimit = require("../utils/limitCheck");

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const fullUser = await User.findById(req.user._id);

  const { allowed, remaining } = checkLimit(fullUser, 'changePasswordAttempts');
  if (!allowed) return res.status(429).json({ message: `Change password limit reached. Try tomorrow.` });

  if (!await bcrypt.compare(currentPassword, fullUser.password))
    return res.status(400).json({ message: "Current password incorrect" });

  fullUser.password = await bcrypt.hash(newPassword, 10);
  await fullUser.save();

  res.json({ message: `Password changed successfully. ${remaining} changes left today.` });
};



exports.deleteAccount = async (req, res) => {
  await req.user.deleteOne();
  res.clearCookie("token");
  res.json({ message: "Account deleted" });
};


exports.setIncome = async (req, res) => {
  const { totalIncome } = req.body;
  if (typeof totalIncome !== "number" || totalIncome < 0)
    return res.status(400).json({ message: "Invalid income value" });

  req.user.totalIncome = totalIncome;
  await req.user.save();

  res.json({ message: "Total income updated", totalIncome });
};


exports.addExpense = async (req, res) => {
  const { name, amount, category } = req.body;

  if (!name || typeof amount !== "number" || amount < 0 || !["essentials", "flexible", "non-essentials"].includes(category)) {
    return res.status(400).json({ message: "Invalid expense input" });
  }

  req.user.expenses.push({ name, amount, category });
  await req.user.save();

  res.json({ message: "Expense added", expenses: req.user.expenses });
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  const toDelete = req.user.expenses.find(e => e._id.toString() === id);
  if (!toDelete) {
    return res.status(404).json({ message: "Expense not found" });
  }

  req.user.expenses = req.user.expenses.filter(e => e._id.toString() !== id);
  await req.user.save();

  res.json({
    message: `Expense ${toDelete.name} from ${toDelete.category} category has been deleted.`,
    deletedExpense: toDelete,
  });
};


exports.getUserProfile = async (req, res) => {
  const user = req.user;

  const totalExpenses = user.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = user.totalIncome - totalExpenses;

  const categoryTotals = {
    essentials: 0,
    flexible: 0,
    "non-essentials": 0
  };

  user.expenses.forEach(expense => {
    if (categoryTotals[expense.category] !== undefined) {
      categoryTotals[expense.category] += expense.amount;
    }
  });

  const sortedExpenses = [...user.expenses].sort((a, b) => b.createdAt - a.createdAt);

  res.json({
    email: user.email,
    totalIncome: user.totalIncome,
    totalExpenses,
    remaining,
    categoryTotals,
    expenses: sortedExpenses
  });
};
