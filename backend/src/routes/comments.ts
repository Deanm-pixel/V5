import express from "express";
import Comment from "../models/Comment";
import Card from "../models/Card";
import Notification from "../models/Notification";
import {requireAuth, requireRole, AuthRequest} from "../middleware/auth";

const router = express.Router();

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const {card, text} = req.body;
  const comment = await Comment.create({card, text, user: req.user.id});
  // Notification für Kartenbesitzer
  const c = await Card.findById(card);
  if (c && String(c.createdBy) !== req.user.id) {
    await Notification.create({
      user: c.createdBy,
      type: "comment",
      card: c._id,
      comment: comment._id,
      text: `Neue Kommentar auf deine Karte "${c.title}"`
    });
  }
  res.json(comment);
});

// Kommentare einer Karte
router.get("/:cardId", requireAuth, async (req, res) => {
  const comments = await Comment.find({card: req.params.cardId}).populate("user", "name role");
  res.json(comments);
});

// Kommentar löschen (Admin, Editor, oder Eigentümer)
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({message: "Nicht gefunden"});
  if (
    req.user.role === "user" && String(comment.user) !== req.user.id
  ) return res.status(403).json({message: "Keine Berechtigung"});
  await comment.deleteOne();
  res.json({ok: true});
});

export default router;
