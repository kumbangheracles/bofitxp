"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
exports.default = (req, res, next) => {
    const authorization = req.headers?.authorization;
    if (!authorization) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }
    const [prefix, token] = authorization.split(" ");
    if (!(prefix === "Bearer" && token)) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }
    const user = (0, jwt_1.getUserData)(token);
    if (!user) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }
    req.user = user;
    next();
};
