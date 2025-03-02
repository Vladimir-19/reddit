const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 5000;

// Set up PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "your-database",
  password: "postgres",
  port: 5432,
});

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Route to fetch data from PostgreSQL
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM your_table");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
