"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../utils/env");
const helpers = () => {
    const expireTime = new Date(Date.now() + env_1.EXPIRE_TTL_MINUTE * 60 * 1000);
    return { expireTime };
};
exports.default = helpers;
