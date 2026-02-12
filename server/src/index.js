import dotenv from "dotenv";
import { app } from "./app.js";

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
