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
  },
  { timestamps: true }
);

export default mongoose.models.App || mongoose.model("App", AppSchema);
