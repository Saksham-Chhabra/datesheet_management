import pg from "pg";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

const { Pool } = pg;


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME ,
  password: process.env.DB_PASSWORD ,
  port: process.env.DB_PORT,
});

// Handling pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Testing the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully at:", res.rows[0]);
  }
});

// Exporting the query method and pool
export default {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};

export { pool };
