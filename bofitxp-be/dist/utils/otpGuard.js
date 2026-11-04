"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpVerificationGuard = exports.otpIpRateLimiter = exports.redis = exports.getClientIp = exports.hashEmailForRedis = exports.isValidEmail = exports.normalizeEmail = exports.AppValidationError = exports.AppDependencyError = exports.AppRateLimitError = exports.OTP_SECURITY_CONFIG = void 0;
exports.reserveIpRateLimit = reserveIpRateLimit;
exports.reserveEmailOtpSend = reserveEmailOtpSend;
exports.reserveOtpSend = reserveOtpSend;
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = require("@upstash/redis");
const ratelimit_1 = require("@upstash/ratelimit");
const env_1 = require("./env");
const pino_1 = __importDefault(require("./pino"));
exports.OTP_SECURITY_CONFIG = {
    ipMaxRequests: 5,
    ipWindowMs: 15 * 60 * 1000,
    ipWindowDuration: "15 m",
    emailCooldownMs: 60 * 1000,
    dailyWindowMs: 24 * 60 * 60 * 1000,
    dailyWindowDuration: "24 h",
    dailyMaxRequests: 10,
    verifyMaxAttempts: 5,
};
class AppRateLimitError extends Error {
    constructor(message, retryAfterMs, code = "RATE_LIMITED") {
        super(message);
        this.name = "AppRateLimitError";
        this.statusCode = 429;
        this.retryAfterMs = retryAfterMs;
        this.code = code;
    }
}
exports.AppRateLimitError = AppRateLimitError;
class AppDependencyError extends Error {
    constructor(message, code = "SERVICE_UNAVAILABLE") {
        super(message);
        this.name = "AppDependencyError";
        this.statusCode = 503;
        this.code = code;
    }
}
exports.AppDependencyError = AppDependencyError;
class AppValidationError extends Error {
    constructor(message, code = "INVALID_INPUT") {
        super(message);
        this.name = "AppValidationError";
        this.statusCode = 400;
        this.code = code;
    }
}
exports.AppValidationError = AppValidationError;
const normalizeEmail = (email) => email.trim().toLowerCase();
exports.normalizeEmail = normalizeEmail;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
exports.isValidEmail = isValidEmail;
const hashEmailForRedis = (email) => {
    const normalized = (0, exports.normalizeEmail)(email);
    if (!env_1.OTP_RATE_LIMIT_SECRET) {
        throw new AppDependencyError("OTP rate limit secret is not configured");
    }
    return crypto_1.default
        .createHmac("sha256", env_1.OTP_RATE_LIMIT_SECRET)
        .update(normalized)
        .digest("hex");
};
exports.hashEmailForRedis = hashEmailForRedis;
const getClientIp = (req) => {
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
exports.getClientIp = getClientIp;
const redisConfig = env_1.UPSTASH_REDIS_REST_URL && env_1.UPSTASH_REDIS_REST_TOKEN
    ? {
        url: env_1.UPSTASH_REDIS_REST_URL,
        token: env_1.UPSTASH_REDIS_REST_TOKEN,
    }
    : null;
exports.redis = redisConfig ? new redis_1.Redis(redisConfig) : null;
exports.otpIpRateLimiter = exports.redis
    ? new ratelimit_1.Ratelimit({
        redis: exports.redis,
        limiter: ratelimit_1.Ratelimit.slidingWindow(exports.OTP_SECURITY_CONFIG.ipMaxRequests, exports.OTP_SECURITY_CONFIG.ipWindowDuration),
        prefix: "otp:ip",
        analytics: false,
        timeout: 1500,
    })
    : null;
async function reserveIpRateLimit(clientIp) {
    if (!exports.redis || !exports.otpIpRateLimiter) {
        pino_1.default.error({ clientIp }, "OTP IP limiter unavailable because Redis is not configured");
        throw new AppDependencyError("OTP rate limiter is unavailable");
    }
    try {
        const result = await exports.otpIpRateLimiter.limit(clientIp);
        if (!result.success) {
            const retryAfterMs = Math.max(Number(result.reset ?? Date.now()) - Date.now(), 1000);
            throw new AppRateLimitError("Too many OTP requests from this IP.", retryAfterMs, "OTP_IP_RATE_LIMITED");
        }
        return true;
    }
    catch (error) {
        if (error instanceof AppRateLimitError) {
            throw error;
        }
        pino_1.default.error({ err: error, clientIp }, "OTP IP limiter failed");
        throw new AppDependencyError("OTP rate limiter is unavailable");
    }
}
async function reserveEmailOtpSend(email) {
    const normalizedEmail = (0, exports.normalizeEmail)(email);
    if (!(0, exports.isValidEmail)(normalizedEmail)) {
        throw new AppValidationError("Invalid email format");
    }
    if (!exports.redis) {
        pino_1.default.error({ emailHash: normalizedEmail }, "OTP email limiter unavailable because Redis is not configured");
        throw new AppDependencyError("OTP rate limiter is unavailable");
    }
    const emailHash = (0, exports.hashEmailForRedis)(normalizedEmail);
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
        const script = exports.redis.createScript(luaScript);
        const result = (await script.eval([cooldownKey, dailyKey, sequenceKey], [
            String(Date.now()),
            String(exports.OTP_SECURITY_CONFIG.emailCooldownMs),
            String(exports.OTP_SECURITY_CONFIG.dailyWindowMs),
            String(exports.OTP_SECURITY_CONFIG.dailyMaxRequests),
        ]));
        if (Number(result[0] ?? 0) !== 1) {
            const retryAfterMs = Math.max(Number(result[1] ?? 0), Number(result[2] ?? 0), 1000);
            throw new AppRateLimitError("OTP is currently rate limited for this email.", retryAfterMs, "OTP_EMAIL_RATE_LIMITED");
        }
        return true;
    }
    catch (error) {
        if (error instanceof AppRateLimitError) {
            throw error;
        }
        pino_1.default.error({ err: error, emailHash }, "OTP email limiter failed");
        throw new AppDependencyError("OTP rate limiter is unavailable");
    }
}
async function reserveOtpSend(email, clientIp) {
    await reserveIpRateLimit(clientIp);
    await reserveEmailOtpSend(email);
    return true;
}
exports.otpVerificationGuard = {
    async consumeAttempt(identifier) {
        if (!exports.redis) {
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
        const redisScript = exports.redis.createScript(script);
        const result = (await redisScript.eval([key], [
            String(now),
            String(exports.OTP_SECURITY_CONFIG.ipWindowMs),
            String(exports.OTP_SECURITY_CONFIG.verifyMaxAttempts),
        ]));
        if (Number(result[0] ?? 0) !== 1) {
            throw new AppRateLimitError("Too many OTP verification attempts for this code.", Number(result[1] ?? 1000), "OTP_VERIFY_RATE_LIMITED");
        }
        return true;
    },
};
