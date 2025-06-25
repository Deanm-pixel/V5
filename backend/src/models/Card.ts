import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  tags: [{type: String}],
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  expiresAt: {type: Date},
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  views: {type: Number, default: 0}
});

export default mongoose.model("Card", CardSchema);
