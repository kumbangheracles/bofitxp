import { NextFunction, Request, Response } from "express";
import {
  AppDependencyError,
  AppRateLimitError,
  getClientIp,
  reserveIpRateLimit,
} from "../utils/otpGuard";

export default async function otpIpRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clientIp = getClientIp(req);
    await reserveIpRateLimit(clientIp);
    return next();
  } catch (error) {
    if (error instanceof AppRateLimitError) {
      res.setHeader(
        "Retry-After",
        String(Math.ceil((error.retryAfterMs ?? 1000) / 1000)),
      );
      return res.status(429).json({
        meta: {
          status: 429,
          message: error.message,
        },
        data: null,
      });
    }

    if (error instanceof AppDependencyError) {
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
