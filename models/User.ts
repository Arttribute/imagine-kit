// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  onchain_address: {
    type: String,
    default: "",
  },
  password: {
    type: String,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
