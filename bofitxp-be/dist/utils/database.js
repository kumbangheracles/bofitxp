"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
// const connect = async () => {
//   try {
//     await mongoose.connect(DATABASE_URL, {
//       dbName: "db-sample",
//     });
//     return Promise.resolve("Database connected");
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };
// export default connect;
// Cache databse
let isConnected = false;
const connect = async () => {
    if (isConnected && mongoose_1.default.connection.readyState === 1) {
        return "Database already connected";
    }
    await mongoose_1.default.connect(env_1.DATABASE_URL, {
        dbName: "db-sample",
    });
    isConnected = true;
    console.log("Database connected");
    return "Database connected";
};
exports.default = connect;
