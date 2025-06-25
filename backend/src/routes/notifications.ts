import express from "express";
import Notification from "../models/Notification";
import {requireAuth, AuthRequest} from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  // Zeigt nur eigene Benachrichtigungen
  const notifs = await Notification.find({user: req.user.id}).sort({createdAt: -1});
  res.json(notifs);
});
router.post("/:id/read", requireAuth, async (req: AuthRequest, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {read: true});
  res.json({ok: true});
});
export default router;
