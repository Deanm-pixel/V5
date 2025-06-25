import express from "express";
import Card from "../models/Card";
import Comment from "../models/Comment";
import {requireAuth, requireRole, AuthRequest} from "../middleware/auth";
import Notification from "../models/Notification";
import User from "../models/User";
import mongoose from "mongoose";
import {exportCardsAsPdf} from "../utils/pdfExport";

const router = express.Router();

// Volltextsuche, Filter, Tag-Filter, Favoriten-Filter
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const {q, tags, sort, author, expired} = req.query;
  let filter: any = {};
  if (q) filter.$or = [
    {title: {$regex: q, $options: "i"}},
    {content: {$regex: q, $options: "i"}}
  ];
  if (tags) filter.tags = {$in: tags.toString().split(",")};
  if (author) filter.createdBy = author;
  if (expired !== undefined) {
    filter.expiresAt = expired === "true" ? {$lt: new Date()} : {$gte: new Date()};
  }
  let query = Card.find(filter).populate("createdBy", "name email role");
  if (sort === "expiresAt") query = query.sort({expiresAt: 1});
  else if (sort === "createdAt") query = query.sort({createdAt: -1});
  res.json(await query.exec());
});

// CRUD
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const {title, content, tags, expiresAt} = req.body;
  const card = await Card.create({
    title, content, tags,
    createdBy: req.user.id,
    expiresAt: expiresAt || null
  });
  res.json(card);
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({message: "Nicht gefunden"});
  if (req.user.role === "user" && String(card.createdBy) !== req.user.id)
    return res.status(403).json({message: "Keine Berechtigung"});
  Object.assign(card, req.body, {updatedAt: new Date()});
  await card.save();
  res.json(card);
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({message: "Nicht gefunden"});
  if (req.user.role === "user" && String(card.createdBy) !== req.user.id)
    return res.status(403).json({message: "Keine Berechtigung"});
  await card.deleteOne();
  await Comment.deleteMany({card: card._id});
  res.json({ok: true});
});

// Favoriten
router.post("/:id/fav", requireAuth, async (req: AuthRequest, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({message: "Nicht gefunden"});
  if (!card.favorites.includes(req.user.id)) card.favorites.push(req.user.id);
  await card.save();
  res.json({favorites: card.favorites.length});
});
router.delete("/:id/fav", requireAuth, async (req: AuthRequest, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({message: "Nicht gefunden"});
  card.favorites = card.favorites.filter((id) => String(id) !== req.user.id);
  await card.save();
  res.json({favorites: card.favorites.length});
});

// Views zählen (für Statistik)
router.post("/:id/view", requireAuth, async (req: AuthRequest, res) => {
  await Card.findByIdAndUpdate(req.params.id, {$inc: {views: 1}});
  res.json({ok: true});
});

// PDF-Multi-Export
router.post("/export/pdf", requireAuth, async (req: AuthRequest, res) => {
  const {ids} = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({message: "Fehlende IDs"});
  const cards = await Card.find({_id: {$in: ids}});
  const pdfBuffer = await exportCardsAsPdf(cards);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=cards.pdf');
  res.send(pdfBuffer);
});

export default router;
