// models/App.js
import mongoose from "mongoose";
import User from "@/models/User";

const AppSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    banner_url: {
      type: String,
    },
    is_private: {
      type: Boolean,
      default: false, // Public by default, charge for private worlds
    },
    is_published: {
      type: Boolean,
      default: false,
    },
    likes_count: {
      type: Number,
      default: 0,
    },
    interactions_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.App || mongoose.model("App", AppSchema);
