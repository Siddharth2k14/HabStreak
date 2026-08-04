import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

type AuthRequest = Request & {
    user?: {
        id: string;
    };
};

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

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        // Creating the user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
                confirmPassword,
                isActive: true,
                isVerified: false,
                verificationToken,
                verificationExpires,
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
        const token = generateAccessToken({
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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
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

        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: "Account has been disabled.",
            });
        }

        if (!user.isVerified) {
            res.status(403).json({
                success: false,
                message: "Please verify your email first.",
            });
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
        const token = generateAccessToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiredAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
            },
        });

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
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

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "Refresh token is required.",
            });

            return;
        }

        const decoded = verifyRefreshToken(refreshToken);

        const storedToken = await prisma.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
        });

        if (!storedToken) {
            res.status(401).json({
                success: false,
                message: "Invalid refresh token.",
            });

            return;
        }

        if (storedToken.expiredAt < new Date()) {
            await prisma.refreshToken.delete({
                where: {
                    token: refreshToken,
                },
            });

            res.status(401).json({
                success: false,
                message: "Refresh token expired.",
            });

            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found.",
            });

            return;
        }

        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: "Account disabled.",
            });

            return;
        }

        if (!user.isVerified) {
            res.status(403).json({
                success: false,
                message: "Email not verified.",
            });

            return;
        }

        // Generate new access token
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully.",
            accessToken,
        });
    } catch (error) {
        console.error(error);

        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token.",
        });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const paramToken = req.params.token;
        const token = Array.isArray(paramToken) ? paramToken[0] : paramToken;

        if (!token) {
            res.status(400).json({
                success: false,
                message: "Verification token is required.",
            });
            return;
        }

        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
            },
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid verification token.",
            });
            return;
        }

        if (user.isVerified) {
            res.status(409).json({
                success: false,
                message: "Email is already verified.",
            });
            return;
        }

        if (
            !user.verificationExpires ||
            user.verificationExpires < new Date()
        ) {
            res.status(400).json({
                success: false,
                message: "Verification token has expired.",
            });
            return;
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationExpires: null,
            },
        });

        res.status(200).json({
            success: true,
            message: "Email verified successfully.",
        });
    } catch (error) {
        console.error("Email Verification Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const logoutUser = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const { refreshToken } = req.body;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authorization token missing.",
            });
            return;
        }

        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: "Refresh token is required.",
            });
            return;
        }

        if (!req.user?.id) {
            res.status(401).json({
                success: false,
                message: "User not authenticated.",
            });
            return;
        }

        const accessToken = authHeader.split(" ")[1];

        // Decode access token to get expiry
        const decoded = jwt.decode(accessToken) as jwt.JwtPayload | null;

        if (decoded?.exp) {
            await prisma.blacklistedToken.create({
                data: {
                    token: accessToken,
                    expiredAt: new Date(decoded.exp * 1000),
                },
            });
        }

        // Delete refresh token
        await prisma.refreshToken.deleteMany({
            where: {
                token: refreshToken,
                userId: req.user.id,
            },
        });

        // Delete active session(s)
        await prisma.session.deleteMany({
            where: {
                userId: req.user.id,
            },
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        console.error("Logout Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};