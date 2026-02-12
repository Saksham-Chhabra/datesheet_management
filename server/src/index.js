import dotenv from "dotenv";
import { app } from "./app.js";
import sequelize from "./db/db.js";

dotenv.config();

const PORT = Number(process.env.PORT || 8000);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
})();
