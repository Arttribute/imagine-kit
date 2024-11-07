// models/Edge.js
import mongoose from "mongoose";
import App from "@/models/App";
import User from "@/models/User";

const BuildChatInteractionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: App,
    required: true,
  },
  user_message: {
    type: String,
    required: true,
  },
  system_message: {
    type: Object,
    required: true,
  },
});

export default mongoose.models.BuildChatInteraction ||
  mongoose.model("BuildChatInteraction", BuildChatInteractionSchema);
