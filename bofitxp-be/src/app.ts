import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import docs from "./docs/route";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Server is running",
    data: null,
  });
});

app.use("/api", router);
docs(app);

export default app;
