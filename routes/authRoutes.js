const router = require("express").Router();
const ctrl = require("../controllers/authController");

router.post("/signup", ctrl.signup);
router.post("/verify", ctrl.verify);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;
