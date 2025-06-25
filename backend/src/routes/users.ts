import express from "express";
import User from "../models/User";
import {requireAuth, requireRole, AuthRequest} from "../middleware/auth";

const router = express.Router();

// User-Infos
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user.id);
  res.json({id: user._id, name: user.name, email: user.email, role: user.role});
});

// Admin: Alle Nutzer sehen & Rollen ändern
router.get("/", requireAuth, requireRole(["admin"]), async (req, res) => {
  res.json(await User.find({}, "name email role createdAt"));
});
router.put("/:id/role", requireAuth, requireRole(["admin"]), async (req, res) => {
  const {role} = req.body;
  if (!["admin", "editor", "user"].includes(role)) return res.status(400).json({message: "Ungültige Rolle"});
  await User.findByIdAndUpdate(req.params.id, {role});
  res.json({ok: true});
});

export default router;
