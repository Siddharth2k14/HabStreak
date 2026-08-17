import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import prisma from "../config/prisma.ts";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.ts";
import ApiError from "../utils/ApiError.ts";
import asyncHandler from "../utils/AsyncHandler.ts";

type AuthRequest = Request & {
    user?: {
        id: string;
    };
};

export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, confirmPassword } = req.body;

    // Check whether the password and confirmPassword matches or not.
    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match.")
    }

    // Check whether the email exists or not.
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new ApiError(409, "Email is already registered.");
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
});

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(401, "User not found.");
    }

    if (!user.isActive) {
        throw new ApiError(403, "Accunt has been disabled.");
    }

    // if (!user.isVerified) {
    //     throw new ApiError(403, "Please verify your email first.");
    // }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password. Check it once.");
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

    await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt: new Date(
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
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is required.");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken,
        },
    });

    if (!storedToken) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    if (storedToken.expiredAt < new Date()) {
        await prisma.refreshToken.delete({
            where: {
                token: refreshToken,
            },
        });

        throw new ApiError(401, "Refresh token expired.");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId,
        },
    });

    if (!user) {
        throw new ApiError(401, "User not found.");
    }

    if (!user.isActive) {
        throw new ApiError(403, "Accunt has been disabled.");
    }

    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email first.");
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
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const paramToken = req.params.token;
    const token = Array.isArray(paramToken) ? paramToken[0] : paramToken;

    if (!token) {
        throw new ApiError(400, "Verification token is required.");
    }

    const user = await prisma.user.findFirst({
        where: {
            verificationToken: token,
        },
    });

    if (!user) {
        throw new ApiError(400, "Invalid verification token");
    }

    if (user.isVerified) {
        throw new ApiError(409, "Email is already verified.");
    }

    if (
        !user.verificationExpires ||
        user.verificationExpires < new Date()
    ) {
        throw new ApiError(400, "Verification token has expired.");
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
});

export const logoutUser = asyncHandler(async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    const authHeader = req.headers.authorization;
    const { refreshToken } = req.body;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Authorization token missing.");
    }

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required.");
    }

    if (!req.user?.id) {
        throw new ApiError(401, "User is not authenticated.");
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
});