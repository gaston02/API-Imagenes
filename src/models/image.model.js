import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    public: {
      type: Boolean,
      required: true,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    galleries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Gallery",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
