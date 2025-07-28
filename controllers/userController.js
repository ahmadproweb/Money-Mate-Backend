const User = require("../models/User");
const bcrypt = require("bcryptjs");
const checkLimit = require("../utils/limitCheck");

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      return res.status(400).json({ message: "New password must be different from the current password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
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

  res.json({ message: "Total income Lock", totalIncome });
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

  const totalIncome = user.totalIncome || 0;

  const expenses = Array.isArray(user.expenses) ? user.expenses : [];

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const remaining = totalIncome - totalExpenses;

  const categoryTotals = {
    essentials: 0,
    flexible: 0,
    "non-essentials": 0,
  };

  expenses.forEach((expense) => {
    if (categoryTotals[expense.category] !== undefined) {
      categoryTotals[expense.category] += expense.amount;
    }
  });

  const sortedExpenses = [...expenses].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
  res.json({
    email: user.email || "",
    totalIncome,
    totalExpenses,
    remaining,
    categoryTotals,
    expenses: sortedExpenses,
  });
};
