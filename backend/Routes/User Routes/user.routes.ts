import express from "express";
import { loginSchema, registerSchema } from "../../validators/auth.validator";
import validate from "../../Middlewares/validation.middleware.ts";
import authenticateUser from "../../Middlewares/auth.middlewares.ts";
import { loginUser, logoutUser, refreshAccessToken, registerUser, verifyEmail } from "../../Controllers/auth.controller.ts";

const router = express.Router();

/**
 * Register
 * username -> string
 * email -> string
 * password -> string
 * confirmPassword -> string
 */
router.post("/register", validate(registerSchema), registerUser);

/**
 * Login
 * email -> string
 * password -> string
 */
router.post("/login", validate(loginSchema), loginUser);

/**
 * Refresh
 */
router.post("/refresh", refreshAccessToken);

/**
 * Verify Token
 */
router.get("/verify/:token", verifyEmail);

/**
 * Logout
 */
router.post("/logout", authenticateUser, logoutUser)