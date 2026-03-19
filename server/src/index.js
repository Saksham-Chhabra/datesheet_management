import dotenv from "dotenv";
import { app } from "./app.js";
import sequelize from "./db/db.js";
import "./models/index.js";

dotenv.config();

const PORT = Number(process.env.PORT || 8000);

(async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    // Sync models (without altering to avoid FK constraint issues)
    await sequelize.sync({ alter: false });
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();
