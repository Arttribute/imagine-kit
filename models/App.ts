// models/App.js
import mongoose from "mongoose";

const AppSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference as a string
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
