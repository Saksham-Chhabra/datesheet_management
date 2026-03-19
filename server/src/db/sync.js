import dotenv from "dotenv";
dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });
import sequelize from "./db.js";
import "../models/index.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // DO NOT USE force:true
    await sequelize.sync({ alter: false });

    console.log("Models synced");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
