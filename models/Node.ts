// models/Node.js
import mongoose from "mongoose";
import App from "@/models/App";

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
  color: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
});

const KnowledgeBaseSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  content: {
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
    knowledgeBase: KnowledgeBaseSchema, // Add knowledgeBase field
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: App,
    required: true,
  },
});

export default mongoose.models.Node || mongoose.model("Node", NodeSchema);
