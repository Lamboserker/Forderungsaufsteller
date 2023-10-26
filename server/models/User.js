import mongoose from "mongoose";

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

export default User;
