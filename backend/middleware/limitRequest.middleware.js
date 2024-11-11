import rateLimit from "express-rate-limit";

// Rate limiter for login route
export const limitRequest = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 4 requests per windowMs //change to 5
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
});