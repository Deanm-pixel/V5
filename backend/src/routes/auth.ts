import express from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const {email, password, name} = req.body;
  if (!email || !password || !name) return res.status(400).json({message: "Fehlende Felder"});
  const existing = await User.findOne({email});
  if (existing) return res.status(400).json({message: "Email vergeben"});
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({email, password: hash, name});
  res.json({token: jwt.sign({id: user._id, role: user.role, name: user.name, email: user.email}, process.env.JWT_SECRET!, {expiresIn: "1d"})});
});

router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) return res.status(400).json({message: "Falsche Daten"});
  if (!await bcrypt.compare(password, user.password)) return res.status(400).json({message: "Falsches Passwort"});
  res.json({token: jwt.sign({id: user._id, role: user.role, name: user.name, email: user.email}, process.env.JWT_SECRET!, {expiresIn: "1d"})});
});

export default router;
