import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] = process.env.JWT_EXPIRES_IN || "7hr" as any;

export interface JwtPayload {
    userId: string;
    username: string;
    email: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};