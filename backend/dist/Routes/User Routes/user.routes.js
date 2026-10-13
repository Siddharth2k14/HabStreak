import express from "express";
import { loginSchema, registerSchema, resendVerificationSchema } from "../../validators/auth.validator.js";
import validate from "../../Middlewares/validation.middleware.js";
import authenticateUser from "../../Middlewares/auth.middlewares.js";
import { loginUser, logoutUser, refreshAccessToken, registerUser, resendVerificationEmail, verifyEmail } from "../../Controllers/auth.controller.js";
import { loginRateLimiter, logoutRateLimiter, refreshRateLimiter, resendVerificationRateLimiter, signupRateLimiter } from "../../Middlewares/rateLimit.middleware.js";
const router = express.Router();
/**
 * Register
 * username -> string
 * email -> string
 * password -> string
 * confirmPassword -> string
 */
router.post("/register", signupRateLimiter, validate(registerSchema), registerUser);
/**
 * Login
 * email -> string
 * password -> string
 */
router.post("/login", loginRateLimiter, validate(loginSchema), loginUser);
/**
 * Refresh
 */
router.post("/refresh", refreshRateLimiter, refreshAccessToken);
/**
 * Resend verification email
 * email -> string
 */
router.post("/resend-verification", resendVerificationRateLimiter, validate(resendVerificationSchema), resendVerificationEmail);
/**
 * Verify Token
 */
router.get("/verify/:token", verifyEmail);
/**
 * Logout
 */
router.post("/logout", logoutRateLimiter, authenticateUser, logoutUser);
export default router;
