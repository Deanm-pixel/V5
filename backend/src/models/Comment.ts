import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  card: {type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true},
  text: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("Comment", CommentSchema);
