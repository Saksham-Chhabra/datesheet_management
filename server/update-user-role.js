import dotenv from "dotenv";
import sequelize from "./src/db/db.js";
import User from "./src/models/User.js";

dotenv.config();

async function updateUserRole() {
  try {
    console.log("Connecting to PostgreSQL...");
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");

    const email = "23bcs098@nith.ac.in";
    const role = "admin";

    console.log(`Updating user ${email} to ${role}...`);

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      console.error("User not found!");
      process.exit(1);
    }

    await user.update({ role });

    console.log(`✓ User role updated successfully!`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

updateUserRole();
