"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const pino_1 = __importDefault(require("./utils/pino"));
const PORT = process.env.PORT || 3000;
app_1.default.listen(Number(PORT), "0.0.0.0", () => {
    pino_1.default.info(`Server is running on port ${PORT}`);
});
