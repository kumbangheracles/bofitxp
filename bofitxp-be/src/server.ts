import app from "./app";
import logger from "./utils/pino";

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info(`Server is running on port ${PORT}`);
});
