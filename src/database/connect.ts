import config from "config";
import mongose from "mongoose";
import logger from "../logger";

function connect() {
  const dbUri = config.get("mongoDbUri") as string;

  try {
    mongose.connect(dbUri);
    logger.info("Database connected");
  } catch (error) {
    logger.error("Database error", error);
    process.exit(1);
  }
}

export default connect;
