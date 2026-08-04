import express from "express";
import { loginSchema, registerSchema } from "../../validators/auth.validator";
import validate from "../../Middlewares/validation.middleware.ts";
import { loginUser, registerUser } from "../../Controllers/auth.controller.ts";

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