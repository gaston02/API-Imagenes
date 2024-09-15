import mongoose from "mongoose";
import { DB } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
};
