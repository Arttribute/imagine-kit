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
    is_remix_of: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "App",
    },
    is_remixable: {
      type: Boolean,
      default: true,
    },
    remix_count: {
      type: Number,
      default: 0,
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
