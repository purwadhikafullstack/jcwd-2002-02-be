const authController = require("../controller/auth");

const router = require("express").Router();

router.post("/register", authController.registerUser);

// login router untuk admin
router.post("/admin/login", authController.loginAdmin);

module.exports = router;
