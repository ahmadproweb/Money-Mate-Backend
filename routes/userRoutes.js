const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/userController");

router.put("/change-password", auth, ctrl.changePassword);
router.delete("/delete-account", auth, ctrl.deleteAccount);
router.put("/income", auth, ctrl.setIncome); 
router.post("/expenses", auth, ctrl.addExpense); 
router.delete("/expenses/:id", auth, ctrl.deleteExpense); 
router.get("/profile", auth, ctrl.getUserProfile);


module.exports = router;
