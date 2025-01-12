import mongoose from "mongoose";

const { Schema } = mongoose; // Desestructuramos Schema de mongoose

const gallerySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    images: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Image",
        required: true,
      },
    ],
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
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
