import jwt from "jsonwebtoken";
// const JWT_SECRET = process.env.JWT_SECRET as string;
// const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] = process.env.JWT_EXPIRES_IN || "15m" as any;
// Tokens
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
// Time limit
const JWT_ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_TOKEN_EXPIRES || "15m";
const JWT_REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_TOKEN_EXPIRES || "30d";
if (!JWT_ACCESS_TOKEN || !JWT_REFRESH_TOKEN) {
    throw new Error("JWT_ACCESS_TOKEN and JWT_REFRESH_TOKEN must be configured.");
}
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_ACCESS_TOKEN, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES,
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_ACCESS_TOKEN);
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_TOKEN, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES,
    });
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_TOKEN);
};
