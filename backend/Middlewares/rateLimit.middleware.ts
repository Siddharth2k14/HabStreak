import rateLimit from "express-rate-limit";

/**
 * Authentication Rate Limiter
 * Limits login, signup, and logout requests.
 */
export const logoutRateLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again after 15 minutes.",
    },

    skipSuccessfulRequests: false,
})

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later.",
    },
});

export const signupRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many signup attempts. Please try again later.",
    },
});

export const refreshRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many refresh requests.",
    },
});