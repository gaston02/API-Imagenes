import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    galleries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Gallery",
        required: false,
      },
    ],
    images: [
      {
        type: Schema.Types.ObjectId,
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

export default mongoose.model("Admin", adminSchema);
