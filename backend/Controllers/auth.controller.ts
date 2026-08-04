import { Request, Response } from "express";
import { success } from "zod";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check whether the password and confirmPassword matches or not.
        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
            return;
        }

        // Check whether the email exists or not.
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "Email is already registered.",
            });
            return;
        }

        // Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        // Creating the user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
                confirmPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Generating the JWT Token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token,
            user,
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const loginUser = async ( req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        // Generate JWT
        const token = generateToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};