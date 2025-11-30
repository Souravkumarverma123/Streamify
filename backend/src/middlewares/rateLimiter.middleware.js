import rateLimit from "express-rate-limit";

// Global rate limiter: 1000 requests per 15 minutes
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});

// Stricter rate limiter for auth routes: 1000 requests per 15 minutes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message:
            "Too many login/signup attempts from this IP, please try again after 15 minutes",
    },
});
