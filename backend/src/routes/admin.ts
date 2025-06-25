import express from "express";
import User from "../models/User";
import Card from "../models/Card";
import Comment from "../models/Comment";
import {requireAuth, requireRole} from "../middleware/auth";

const router = express.Router();

router.get("/stats", requireAuth, requireRole(["admin"]), async (req, res) => {
  const [userCount, cardCount, commentCount] = await Promise.all([
    User.countDocuments({}),
    Card.countDocuments({}),
    Comment.countDocuments({})
  ]);
  const expiredCount = await Card.countDocuments({expiresAt: {$lt: new Date()}});
  const favs = await Card.aggregate([
    {$project: {favCount: {$size: "$favorites"}}},
    {$group: {_id: null, total: {$sum: "$favCount"}}}
  ]);
  const mostFav = await Card.find({}).sort({"favorites.length": -1}).limit(5).select("title favorites");
  const mostViewed = await Card.find({}).sort({views: -1}).limit(5).select("title views");
  const mostCommented = await Comment.aggregate([
    {$group: {_id: "$card", count: {$sum: 1}}},
    {$sort: {count: -1}},
    {$limit: 5}
  ]);
  // Kartenaktivität pro Woche, Monat
  const weekly = await Card.aggregate([
    {
      $group: {
        _id: {week: {$isoWeek: "$createdAt"}, year: {$year: "$createdAt"}},
        count: {$sum: 1}
      }
    }, {$sort: {"_id.year": 1, "_id.week": 1}}
  ]);
  const monthly = await Card.aggregate([
    {
      $group: {
        _id: {month: {$month: "$createdAt"}, year: {$year: "$createdAt"}},
        count: {$sum: 1}
      }
    }, {$sort: {"_id.year": 1, "_id.month": 1}}
  ]);
  res.json({
    userCount, cardCount, commentCount, expiredCount,
    favs: favs[0]?.total || 0, mostFav, mostViewed, mostCommented, weekly, monthly
  });
});

export default router;
