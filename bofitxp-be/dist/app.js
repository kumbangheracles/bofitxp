"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_1 = __importDefault(require("./docs/route"));
const cors_1 = __importDefault(require("cors"));
const pino_http_1 = __importDefault(require("pino-http"));
const pino_1 = __importDefault(require("./utils/pino"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, pino_http_1.default)({
    logger: pino_1.default,
}));
app.get("/", (_, res) => {
    res.status(200).json({
        message: "Server is running",
        data: null,
    });
});
app.use("/api", api_1.default);
(0, route_1.default)(app);
exports.default = app;
