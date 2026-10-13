import crypto from "crypto";

export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

export const hashVerificationToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};
