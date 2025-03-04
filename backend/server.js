require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { Client } = require("pg");

const app = express();
const port = process.env.PORT || 3031;

// Middleware
app.use(
  cors({
    origin: "http://localhost:8084",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

// PostgreSQL Client setup
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();

// client.query(
// CREATE TABLE IF NOT EXISTS posts (
// reddit-sql::DATABASE(>     id SERIAL PRIMARY KEY,
// reddit-sql::DATABASE(>     title VARCHAR(255),
// reddit-sql::DATABASE(>     content TEXT,
// reddit-sql::DATABASE(>     date TIMESTAMPTZ,
// reddit-sql::DATABASE(>     author VARCHAR(255)
// reddit-sql::DATABASE(> );
//   `
//   CREATE TABLE IF NOT EXISTS comments (
//     id SERIAL PRIMARY KEY,
//     author VARCHAR(255),
//     text TEXT,
//     date TIMESTAMPTZ,
//     likes INT,
//     image VARCHAR(255)
//   );
// `,
//   (err, res) => {
//     if (err) {
//       console.error("Error creating table:", err);
//     } else {
//       console.log("Table created or already exists");
//     }
//   }
// );

// Route to fetch all comments
app.get("/api/comments", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM public.comments");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).send("Server error");
  }
});

// GET all posts
app.get("/api/comments/:postId", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [req.params.postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching post comments:", err);
    res.status(500).send("Server error");
  }
});

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM posts ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Server error");
  }
});

// POST a new comment
app.post("/api/comments", async (req, res) => {
  const { id, author, text, image } = req.body;
  const date = new Date();
  const updatedAt = date;
  try {
    const result = await client.query(
      "INSERT INTO comments (id, author, text, date, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, author, text, date, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).send("Server error");
  }
});

// PUT (Edit) a comment
app.put("/api/comments/:id", async (req, res) => {
  const { text } = req.body;
  const updatedAt = new Date();

  try {
    const result = await client.query(
      "UPDATE comments SET text = $1, date = $2 WHERE id = $3 RETURNING *",
      [text, updatedAt, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Comment not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).send("Server error");
  }
});

// DELETE a comment
app.delete("/api/comments/:id", async (req, res) => {
  try {
    const result = await client.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Comment not found");
    }
    res.status(204).send(); // No content response on successful deletion
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
