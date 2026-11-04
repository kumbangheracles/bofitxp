"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodeExpirationTime = exports.generateVerificationCode = void 0;
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
const getCodeExpirationTime = (minutes = 5) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};
exports.getCodeExpirationTime = getCodeExpirationTime;
