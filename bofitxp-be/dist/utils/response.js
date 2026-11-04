"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Yup = __importStar(require("yup"));
const otpGuard_1 = require("./otpGuard");
exports.default = {
    success(res, data, message) {
        res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
        });
    },
    error(res, error, message) {
        if (error instanceof otpGuard_1.AppRateLimitError) {
            return res.status(429).json({
                meta: {
                    status: 429,
                    message: error.message,
                },
                data: null,
                retryAfterMs: error.retryAfterMs,
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
        if (error instanceof otpGuard_1.AppValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message: error.message,
                },
                data: null,
            });
        }
        if (error instanceof Yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message,
                },
                data: {
                    [`${error.path}`]: error.errors,
                },
            });
        }
        if (error instanceof mongoose_1.default.Error) {
            return res.status(500).json({
                meta: {
                    message: error.message,
                },
                data: error.name,
            });
        }
        if (error?.code) {
            const _err = error;
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: _err,
                },
                data: _err,
            });
        }
        res.status(500).json({
            meta: {
                status: 500,
                message,
            },
            data: error,
        });
    },
    unauthorized(res, message = "unauthorized") {
        res.status(403).json({
            meta: {
                status: 403,
                message,
            },
            data: null,
        });
    },
    pagination(res, data, pagination, message) {
        res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
            pagination,
        });
    },
};
