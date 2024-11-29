// models/UIComponent.js
import mongoose from "mongoose";
import App from "@/models/App";

const UIComponentSchema = new mongoose.Schema({
  component_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  field_types: {
    type: [String],
  },
  label: {
    type: String,
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
  },
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: App,
    required: true,
  },
});

export default mongoose.models.UIComponent ||
  mongoose.model("UIComponent", UIComponentSchema);
