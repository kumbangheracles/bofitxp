import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

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
  if (isConnected && mongoose.connection.readyState === 1) {
    return "Database already connected";
  }

  await mongoose.connect(DATABASE_URL, {
    dbName: "db-sample",
  });

  isConnected = true;

  console.log("Database connected");

  return "Database connected";
};

export default connect;
