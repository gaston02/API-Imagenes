import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nameUser: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    userInfo: {
      type: String,
      required: false,
      trim: true,
    },
    galleries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gallery",
        required: false,
      },
    ],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        required: false,
      },
    ],
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
