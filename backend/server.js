require("dotenv").config();
const express = require("express");
const path = require("path");
const { Client } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1); // Exit if DATABASE_URL is not defined
}

// PostgreSQL Client setup
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();

// GET all comments for a post
app.get("/api/comments/:postId", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [req.params.postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST a new comment
app.post("/api/comments", async (req, res) => {
  const { post_id, author, text, image_url } = req.body;
  const createdAt = new Date();
  const updatedAt = createdAt;

  try {
    const result = await client.query(
      "INSERT INTO comments (post_id, author, text, created_at, updated_at, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [post_id, author, text, createdAt, updatedAt, image_url]
    );
    res.json(result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// PUT (Edit) a comment
app.put("/api/comments/:id", async (req, res) => {
  const { text } = req.body;
  const updatedAt = new Date();

  try {
    const result = await client.query(
      "UPDATE comments SET text = $1, updated_at = $2 WHERE id = $3 RETURNING *",
      [text, updatedAt, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Comment not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
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
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
