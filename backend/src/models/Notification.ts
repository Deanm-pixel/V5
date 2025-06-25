import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  type: {type: String, enum: ["comment", "expired"], required: true},
  card: {type: mongoose.Schema.Types.ObjectId, ref: "Card"},
  comment: {type: mongoose.Schema.Types.ObjectId, ref: "Comment"},
  text: {type: String},
  read: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("Notification", NotificationSchema);
