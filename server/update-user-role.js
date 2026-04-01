import dotenv from "dotenv";
import sequelize from "./src/db/db.js";
import User from "./src/models/User.js";

dotenv.config();

async function updateUserRole() {
  try {
    console.log("Connecting to PostgreSQL...");
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");

    const email = (process.argv[2] || "23bcs100@nith.ac.in")
      .toLowerCase()
      .trim();
    const role = (process.argv[3] || "admin").toLowerCase().trim();

    if (!["student", "admin"].includes(role)) {
      console.error("Invalid role. Use 'student' or 'admin'.");
      process.exit(1);
    }

    console.log(`Updating user ${email} to ${role}...`);

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      console.error("User not found!");
      process.exit(1);
    }

    if (user.role === role) {
      console.log(`No update needed. User already has role: ${role}`);
      process.exit(0);
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
