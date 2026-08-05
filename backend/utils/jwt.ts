import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET as string;
// const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] = process.env.JWT_EXPIRES_IN || "15m" as any;

// Tokens
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN as string;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN as string;

// Time limit
const JWT_ACCESS_TOKEN_EXPIRES: jwt.SignOptions["expiresIn"] = process.env.JWT_ACCESS_TOKEN_EXPIRES || "15m" as any;
const JWT_REFRESH_TOKEN_EXPIRES: jwt.SignOptions["expiresIn"] = process.env.JWT_REFRESH_TOKEN_EXPIRES || "30d" as any;

export interface JwtPayload {
    userId: string;
    username: string;
    email: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_ACCESS_TOKEN, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES,
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_ACCESS_TOKEN) as JwtPayload;
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_REFRESH_TOKEN, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES,
    });
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_REFRESH_TOKEN) as JwtPayload;
};