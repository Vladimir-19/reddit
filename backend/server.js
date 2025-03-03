require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

// Serve static files from Vue app
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start your server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
