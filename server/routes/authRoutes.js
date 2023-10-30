import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  const usernames = await User.find().select("username -_id");
  res.json({ usernames: usernames.map((u) => u.username) });
});

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials at username" });
  }

  // Compare hashed password with the provided password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials at password" });
  }

  res.json({ status: "success" });
});

export default router;
