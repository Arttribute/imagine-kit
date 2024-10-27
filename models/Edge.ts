// models/Edge.js
import mongoose from "mongoose";
import App from "@/models/App";

const EdgeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  sourceHandle: {
    type: String,
    required: true,
  },
  targetHandle: {
    type: String,
    required: true,
  },
  color: {
    type: String, // New field to store color of the edge
    default: "", // Default to an empty string if color is not set
  },
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: App,
    required: true,
  },
});

export default mongoose.models.Edge || mongoose.model("Edge", EdgeSchema);
