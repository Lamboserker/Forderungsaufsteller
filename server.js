const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let claims = [];

// POST request to add new claims or update existing ones
app.post("/api/claims", (req, res) => {
  const { caseNumber, amount } = req.body;

  const index = claims.findIndex((c) => c.caseNumber === caseNumber);
  if (index !== -1) {
    claims[index].amount = amount;
  } else {
    claims.push({ caseNumber, amount });
  }

  res.json({ status: "success", claims });
});

// GET request to fetch all saved claims
app.get("/api/claims", (req, res) => {
  res.json(claims);
});

// DELETE request to remove a specific claim
app.delete("/api/claims", (req, res) => {
  const { caseNumber } = req.body;

  const index = claims.findIndex((c) => c.caseNumber === caseNumber);
  if (index === -1) {
    return res
      .status(404)
      .json({ status: "error", message: "Claim not found" });
  }

  claims.splice(index, 1);
  res.json({ status: "success", claims });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
