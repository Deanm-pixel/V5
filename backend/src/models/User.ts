import mongoose from "mongoose";

export type UserRole = "admin" | "editor" | "user";

const UserSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  role: {type: String, enum: ["admin", "editor", "user"], default: "user"},
  createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("User", UserSchema);
