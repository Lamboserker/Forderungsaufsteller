import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB-connection
const MONGODB_URI =
  "mongodb+srv://lukaslamberz96:g6C17rGzD9ZRNAyk@clusterforderung.un8rqs9.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to MongoDB!");
});

// data model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  claims: [
    {
      caseNumber: String,
      amount: Number,
      creditorName: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

// User registration
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res
      .status(400)
      .json({ status: "error", message: "User already exists" });
  }

  //Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, password: hashedPassword, claims: [] });
  await user.save();
  res.json({ status: "success" });
});

// User Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }

  // Compare hashed password with the provided password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }

  res.json({ status: "success" });
});

// GET request to fetch all usernames
app.get("/api/users", async (req, res) => {
  const usernames = await User.find().select("username -_id");
  res.json({ usernames: usernames.map((u) => u.username) });
});

// POST request to add new claims or update existing ones
app.post("/api/claims", async (req, res) => {
  const { username, caseNumber, amount, creditorName } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ status: "error", message: "User not found" });
  }

  const index = user.claims.findIndex((c) => c.caseNumber === caseNumber);
  if (index !== -1) {
    user.claims[index].amount = amount;
  } else {
    user.claims.push({ caseNumber, amount, creditorName });
  }

  await user.save();
  res.json({ status: "success", claims: user.claims });
});

// GET request to fetch all saved claims
app.get("/api/claims", async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ status: "error", message: "User not found" });
  }
  res.json(user.claims);
});

// DELETE request to remove a specific claim
app.delete("/api/claims", async (req, res) => {
  const { username, caseNumber } = req.body;
  const user = await User.findOne({ username });
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
  await user.save();
  res.json({ status: "success", claims: user.claims });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ status: "error", message: "Server error" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
