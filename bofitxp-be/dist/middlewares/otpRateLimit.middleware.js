"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = otpIpRateLimitMiddleware;
const otpGuard_1 = require("../utils/otpGuard");
async function otpIpRateLimitMiddleware(req, res, next) {
    try {
        const clientIp = (0, otpGuard_1.getClientIp)(req);
        await (0, otpGuard_1.reserveIpRateLimit)(clientIp);
        return next();
    }
    catch (error) {
        if (error instanceof otpGuard_1.AppRateLimitError) {
            res.setHeader("Retry-After", String(Math.ceil((error.retryAfterMs ?? 1000) / 1000)));
            return res.status(429).json({
                meta: {
                    status: 429,
                    message: error.message,
                },
                data: null,
            });
        }
        if (error instanceof otpGuard_1.AppDependencyError) {
            return res.status(503).json({
                meta: {
                    status: 503,
                    message: error.message,
                },
                data: null,
            });
        }
        return next(error);
    }
}
