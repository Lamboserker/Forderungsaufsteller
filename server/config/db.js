import mongoose from "mongoose";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("connected to MongoDB!");
  });
};

export default connectDB;
