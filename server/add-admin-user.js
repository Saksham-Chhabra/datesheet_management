import dotenv from "dotenv";
import sequelize from "./src/db/db.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";

dotenv.config();

async function addAdminUser() {
  try {
    console.log("Connecting to PostgreSQL...");
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");

    const email = "23bcs098@nith.ac.in";
    const password = "23bcs098"; // Default password
    const role = "admin";

    console.log(`Checking if user ${email} exists...`);
    let user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      console.log("User already exists. Updating role to admin...");
      await user.update({ role });
    } else {
      console.log("User doesn't exist. Creating new admin user...");
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
      });
      console.log("User created successfully");
    }

    console.log(`✓ Done!`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

addAdminUser();
