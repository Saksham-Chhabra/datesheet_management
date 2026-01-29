import { pool } from "./index.js";
const connectDB = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(" Database connected successfully at:", result.rows[0].now);
    return true;
  } catch (err) {
    console.error(" Database connection failed:", err);
    throw err;
  }
};
export default connectDB;
