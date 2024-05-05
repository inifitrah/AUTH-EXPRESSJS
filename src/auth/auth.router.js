const express = require("express");
const router = express.Router();
const AuthController = require("./auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkUserPermissionMiddleware = require("../middlewares/checkUserPersmission.middleware");

router.get("/refresh-token", AuthController.refreshToken);
router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.delete("/logout", AuthController.logout);
router.post("/otp", [checkUserPermissionMiddleware], AuthController.otp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;