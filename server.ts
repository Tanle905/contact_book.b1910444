import { app } from "./app";
import { config } from "./app/config";
import { MongoDB } from "./app/utils/mongodb.util";

export async function startServer() {
  try {
    await MongoDB.connect(config.app.db);
    console.log("Connected to database!");

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to database!", error);
    process.exit();
  }
}

startServer();