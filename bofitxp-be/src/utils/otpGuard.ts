import crypto from "crypto";
import { Request } from "express";
import { Redis, type RedisConfigNodejs } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import {
  OTP_RATE_LIMIT_SECRET,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "./env";
import logger from "./pino";

export const OTP_SECURITY_CONFIG = {
  ipMaxRequests: 5,
  ipWindowMs: 15 * 60 * 1000,
  ipWindowDuration: "15 m" as const,
  emailCooldownMs: 60 * 1000,
  dailyWindowMs: 24 * 60 * 60 * 1000,
  dailyWindowDuration: "24 h" as const,
  dailyMaxRequests: 10,
  verifyMaxAttempts: 5,
} as const;

export class AppRateLimitError extends Error {
  statusCode: number;
  retryAfterMs?: number;
  code: string;

  constructor(message: string, retryAfterMs?: number, code = "RATE_LIMITED") {
    super(message);
    this.name = "AppRateLimitError";
    this.statusCode = 429;
    this.retryAfterMs = retryAfterMs;
    this.code = code;
  }
}

export class AppDependencyError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, code = "SERVICE_UNAVAILABLE") {
    super(message);
    this.name = "AppDependencyError";
    this.statusCode = 503;
    this.code = code;
  }
}

export class AppValidationError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, code = "INVALID_INPUT") {
    super(message);
    this.name = "AppValidationError";
    this.statusCode = 400;
    this.code = code;
  }
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const hashEmailForRedis = (email: string) => {
  const normalized = normalizeEmail(email);

  if (!OTP_RATE_LIMIT_SECRET) {
    throw new AppDependencyError("OTP rate limit secret is not configured");
  }

  return crypto
    .createHmac("sha256", OTP_RATE_LIMIT_SECRET)
    .update(normalized)
    .digest("hex");
};

export const getClientIp = (req: Request) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first.replace(/^::ffff:/, "");
    }
  }

  const remote = req.socket?.remoteAddress ?? req.ip ?? "";
  if (remote) {
    return remote.replace(/^::ffff:/, "");
  }

  throw new AppValidationError("Unable to determine client IP safely");
};

const redisConfig: RedisConfigNodejs | null =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
    ? {
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      }
    : null;

export const redis = redisConfig ? new Redis(redisConfig) : null;

export const otpIpRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        OTP_SECURITY_CONFIG.ipMaxRequests,
        OTP_SECURITY_CONFIG.ipWindowDuration,
      ),
      prefix: "otp:ip",
      analytics: false,
      timeout: 1500,
    })
  : null;

export async function reserveIpRateLimit(clientIp: string) {
  if (!redis || !otpIpRateLimiter) {
    logger.error(
      { clientIp },
      "OTP IP limiter unavailable because Redis is not configured",
    );
    throw new AppDependencyError("OTP rate limiter is unavailable");
  }

  try {
    const result = await otpIpRateLimiter.limit(clientIp);

    if (!result.success) {
      const retryAfterMs = Math.max(
        Number(result.reset ?? Date.now()) - Date.now(),
        1000,
      );

      throw new AppRateLimitError(
        "Too many OTP requests from this IP.",
        retryAfterMs,
        "OTP_IP_RATE_LIMITED",
      );
    }

    return true;
  } catch (error) {
    if (error instanceof AppRateLimitError) {
      throw error;
    }

    logger.error({ err: error, clientIp }, "OTP IP limiter failed");
    throw new AppDependencyError("OTP rate limiter is unavailable");
  }
}

export async function reserveEmailOtpSend(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new AppValidationError("Invalid email format");
  }

  if (!redis) {
    logger.error(
      { emailHash: normalizedEmail },
      "OTP email limiter unavailable because Redis is not configured",
    );
    throw new AppDependencyError("OTP rate limiter is unavailable");
  }

  const emailHash = hashEmailForRedis(normalizedEmail);
  const cooldownKey = `otp:email:cooldown:${emailHash}`;
  const dailyKey = `otp:email:daily:${emailHash}`;
  const sequenceKey = `otp:email:seq:${emailHash}`;

  const luaScript = `
    local cooldownKey = KEYS[1]
    local dailyKey = KEYS[2]
    local sequenceKey = KEYS[3]
    local now = tonumber(ARGV[1])
    local cooldownMs = tonumber(ARGV[2])
    local dailyWindowMs = tonumber(ARGV[3])
    local maxPerDay = tonumber(ARGV[4])

    local cooldownUntil = redis.call('HGET', cooldownKey, 'until')
    if cooldownUntil ~= false and tonumber(cooldownUntil) > now then
      return {0, tonumber(cooldownUntil) - now, 0}
    end

    redis.call('ZREMRANGEBYSCORE', dailyKey, '-inf', now - dailyWindowMs)
    local dailyCount = tonumber(redis.call('ZCARD', dailyKey) or 0)
    if dailyCount >= maxPerDay then
      local oldest = redis.call('ZRANGE', dailyKey, 0, 0, 'WITHSCORES')
      local retryAt = 0
      if oldest and #oldest >= 2 then
        retryAt = tonumber(oldest[2]) + dailyWindowMs - now
      end
      return {0, 0, math.max(retryAt, 1)}
    end

    redis.call('HSET', cooldownKey, 'until', now + cooldownMs)
    local seq = tostring(redis.call('INCR', sequenceKey))
    redis.call('ZADD', dailyKey, now, now .. ':' .. seq)
    return {1, 0, 0}
  `;

  try {
    const script = redis.createScript<number[]>(luaScript);
    const result = (await script.eval(
      [cooldownKey, dailyKey, sequenceKey],
      [
        String(Date.now()),
        String(OTP_SECURITY_CONFIG.emailCooldownMs),
        String(OTP_SECURITY_CONFIG.dailyWindowMs),
        String(OTP_SECURITY_CONFIG.dailyMaxRequests),
      ],
    )) as number[];

    if (Number(result[0] ?? 0) !== 1) {
      const retryAfterMs = Math.max(
        Number(result[1] ?? 0),
        Number(result[2] ?? 0),
        1000,
      );

      throw new AppRateLimitError(
        "OTP is currently rate limited for this email.",
        retryAfterMs,
        "OTP_EMAIL_RATE_LIMITED",
      );
    }

    return true;
  } catch (error) {
    if (error instanceof AppRateLimitError) {
      throw error;
    }

    logger.error({ err: error, emailHash }, "OTP email limiter failed");
    throw new AppDependencyError("OTP rate limiter is unavailable");
  }
}

export async function reserveOtpSend(email: string, clientIp: string) {
  await reserveIpRateLimit(clientIp);
  await reserveEmailOtpSend(email);
  return true;
}

export const otpVerificationGuard = {
  async consumeAttempt(identifier: string) {
    if (!redis) {
      throw new AppDependencyError("OTP verification limiter is unavailable");
    }

    const key = `otp:verify:${identifier}`;
    const now = Date.now();
    const script = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local windowMs = tonumber(ARGV[2])
      local maxAttempts = tonumber(ARGV[3])

      redis.call('ZREMRANGEBYSCORE', key, '-inf', now - windowMs)
      local count = tonumber(redis.call('ZCARD', key) or 0)
      if count >= maxAttempts then
        local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
        local retryAt = 0
        if oldest and #oldest >= 2 then
          retryAt = tonumber(oldest[2]) + windowMs - now
        end
        return {0, math.max(retryAt, 1)}
      end

      local seq = tostring(redis.call('INCR', key .. ':seq'))
      redis.call('ZADD', key, now, now .. ':' .. seq)
      return {1, 0}
    `;

    const redisScript = redis.createScript<number[]>(script);
    const result = (await redisScript.eval(
      [key],
      [
        String(now),
        String(OTP_SECURITY_CONFIG.ipWindowMs),
        String(OTP_SECURITY_CONFIG.verifyMaxAttempts),
      ],
    )) as number[];

    if (Number(result[0] ?? 0) !== 1) {
      throw new AppRateLimitError(
        "Too many OTP verification attempts for this code.",
        Number(result[1] ?? 1000),
        "OTP_VERIFY_RATE_LIMITED",
      );
    }

    return true;
  },
};
