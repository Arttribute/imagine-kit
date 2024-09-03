// models/Edge.js
import mongoose from "mongoose";

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
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "App",
    required: true,
  },
});

export default mongoose.models.Edge || mongoose.model("Edge", EdgeSchema);
