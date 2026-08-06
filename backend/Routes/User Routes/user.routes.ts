import express from "express";
import { loginSchema, registerSchema } from "../../validators/auth.validator.ts";
import validate from "../../Middlewares/validation.middleware.ts";
import authenticateUser from "../../Middlewares/auth.middlewares.ts";
import { loginUser, logoutUser, refreshAccessToken, registerUser, verifyEmail } from "../../Controllers/auth.controller.ts";
import { loginRateLimiter, logoutRateLimiter, refreshRateLimiter, signupRateLimiter } from "../../Middlewares/rateLimit.middleware.ts";

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
 * Verify Token
 */
router.get("/verify/:token", verifyEmail);

/**
 * Logout
 */
router.post("/logout", logoutRateLimiter, authenticateUser, logoutUser)

export default router;