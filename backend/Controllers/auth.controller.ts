import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.ts";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.ts";
import type {JwtPayload} from "../utils/jwt.ts";
import ApiError from "../utils/ApiError.ts";
import asyncHandler from "../utils/AsyncHandler.ts";
import {
  generateVerificationToken,
  hashVerificationToken,
} from "../utils/token.utils.ts";
import { sendVerificationEmail } from "../services/email.service.ts";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from "../utils/authCookie.ts";
import { serialize } from "v8";

type AuthRequest = Request & {
  user?: {
    id: string;
  };
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, confirmPassword } = req.body;

    // Check whether the password and confirmPassword matches or not.
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match.");
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

    const verificationToken = generateVerificationToken();
    const hashedVerificationToken = hashVerificationToken(verificationToken);
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Creating the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        isActive: true,
        isVerified: false,
        verificationToken: hashedVerificationToken,
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

    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.username,
        token: verificationToken,
      });
    } catch (error) {
      console.error("Verification email failed:", error);

      throw new ApiError(
        500,
        "Account created but verification email could not be sent.",
      );
    }

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
  },
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

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

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt,
        ipAddress: req.ip,
        device: req.get("user-agent") ?? null,
      },
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        sessionId: session.id,
        expiredAt: expiresAt,
      },
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  },
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken || typeof refreshToken !== "string") {
      throw new ApiError(401, "Refresh token is missing or invalid.");
    }

    let decoded: JwtPayload;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      clearRefreshTokenCookie(res);
      throw new ApiError(401, "Invalid or expired refresh token.");
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        session: true,
      },
    });

    if (!storedToken || !storedToken.session) {
      clearRefreshTokenCookie(res);
      throw new ApiError(401, "Refresh token is invalid.");
    }

    const now = new Date();

    if (storedToken.expiredAt <= now || storedToken.session.expiresAt <= now) {
      await prisma.refreshToken.deleteMany({
        where: {
          sessionId: storedToken.sessionId,
        },
      });

      await prisma.session.deleteMany({
        where: {
          id: storedToken.sessionId!,
        },
      });

      clearRefreshTokenCookie(res);
      throw new ApiError(401, "Session has expired.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user || !user.isActive || !user.isVerified) {
      clearRefreshTokenCookie(res);
      throw new ApiError(401, "Account is not authorized.");
    }

    if (storedToken.userId !== user.id) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tr) => {
      await tr.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      });

      await tr.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          sessionId: storedToken.sessionId,
          expiredAt: newExpiry,
        },
      });

      await tr.session.update({
        where: {
          id: storedToken.sessionId!,
        },
        data: {
          expiresAt: newExpiry,
        },
      });
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  },
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const paramToken = req.params.token;

    const token = Array.isArray(paramToken) ? paramToken[0] : paramToken;

    if (!token) {
      throw new ApiError(400, "Verification token is required.");
    }

    const hashedToken = hashVerificationToken(token);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ verificationToken: hashedToken }, { verificationToken: token }],
      },
    });

    if (!user) {
      throw new ApiError(400, "Invalid verification token.");
    }

    if (user.isVerified) {
      throw new ApiError(409, "Email is already verified.");
    }

    if (!user.verificationExpires || user.verificationExpires < new Date()) {
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

    res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
  },
);

export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email.trim();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.isVerified) {
      res.status(200).json({
        success: true,
        message: "Email is already verified.",
      });
      return;
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account has been disabled.");
    }

    const verificationToken = generateVerificationToken();
    const hashedVerificationToken = hashVerificationToken(verificationToken);
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verificationToken: hashedVerificationToken,
        verificationExpires,
      },
    });

    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.username,
        token: verificationToken,
      });
    } catch (error) {
      console.error("Verification email resend failed:", error);

      throw new ApiError(500, "Verification email could not be sent.");
    }

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully.",
    });
  },
);

export const logoutUser = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token missing.");
    }

    if (!refreshToken) {
      clearRefreshTokenCookie(res);

      res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
      return;
    }

    if (!req.user?.id) {
      throw new ApiError(401, "User is not authenticated.");
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (storedToken && storedToken.userId === req.user!.id && storedToken.sessionId) {
      await prisma.$transaction(async (tr) => {
        await tr.refreshToken.deleteMany({
          where: {
            sessionId: storedToken.sessionId,
            userId: req.user!.id,
          },
        });

        await tr.session.deleteMany({
          where: {
            id: storedToken.sessionId!,
            userId: req.user!.id,
          },
        });
      });
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  },
);
