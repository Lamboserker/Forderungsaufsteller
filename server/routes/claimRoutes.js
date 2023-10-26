import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/api/users", async (req, res) => {
  const usernames = await User.find().select("username -_id");
  res.json({ usernames: usernames.map((u) => u.username) });
});

router.get("/api/claims", async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ status: "error", message: "User not found" });
  }
  res.json(user.claims);
});


router.delete("/api/claims", async (req, res) => {
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

export default router;
