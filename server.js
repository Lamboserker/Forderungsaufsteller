const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = {};

// User Registration
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res
      .status(400)
      .json({ status: "error", message: "User already exists" });
  }
  users[username] = { password, claims: [] };
  res.json({ status: "success" });
});

// User Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }
  res.json({ status: "success" });
});

// GET request to fetch all usernames
app.get("/api/users", (req, res) => {
  res.json({ usernames: Object.keys(users) });
});

// POST request to add new claims or update existing ones
app.post("/api/claims", (req, res) => {
  const { username, caseNumber, amount } = req.body;
  const user = users[username];
  if (!user) {
    return res.status(401).json({ status: "error", message: "User not found" });
  }

  const index = user.claims.findIndex((c) => c.caseNumber === caseNumber);
  if (index !== -1) {
    user.claims[index].amount = amount;
  } else {
    user.claims.push({ caseNumber, amount });
  }

  res.json({ status: "success", claims: user.claims });
});

// GET request to fetch all saved claims
app.get("/api/claims", (req, res) => {
  const { username } = req.query;
  const user = users[username];
  if (!user) {
    return res.status(401).json({ status: "error", message: "User not found" });
  }
  res.json(user.claims);
});

// DELETE request to remove a specific claim
app.delete("/api/claims", (req, res) => {
  const { username, caseNumber } = req.body;
  const user = users[username];
  if (!user) {
    return res.status(401).json({ status: "error", message: "User not found" });
  }

  const index = user.claims.findIndex((c) => c.caseNumber === caseNumber);
  if (index === -1) {
    return res
      .status(404)
      .json({ status: "error", message: "Claim not found" });
  }

  user.claims.splice(index, 1);
  res.json({ status: "success", claims: user.claims });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
