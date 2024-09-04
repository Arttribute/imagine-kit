// models/Node.js
import mongoose from "mongoose";

const InputOutputSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  value: {
    type: String,
  },
});

const NodeSchema = new mongoose.Schema({
  node_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  data: {
    inputs: [InputOutputSchema],
    outputs: [InputOutputSchema],
    instruction: { type: String },
    memoryFields: [InputOutputSchema],
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "App", // Reference as a string
    required: true,
  },
});

export default mongoose.models.Node || mongoose.model("Node", NodeSchema);
