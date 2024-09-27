// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  display_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: "",
  },
  profile_image: {
    type: String,
    default: "",
  },
  onchain_address: {
    type: String,
    default: "",
  },
  password: {
    type: String,
  },
  followercount: {
    type: Number,
    default: 0,
  },
  followingcount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
