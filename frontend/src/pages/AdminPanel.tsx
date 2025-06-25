import React, {useEffect, useState} from "react";
import api from "../api";
import {BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend} from "recharts";

export default function AdminPanel() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { api.get("/admin/stats").then(res=>setStats(res.data)); }, []);
  if (!stats) return <div>Lädt...</div>;
  return (
    <div>
      <h2>Admin-Statistiken</h2>
      <div>Nutzer: {stats.userCount} | Karten: {stats.cardCount} | Kommentare: {stats.commentCount}</div>
      <div>Abgelaufene Karten: {stats.expiredCount}</div>
      <h3>Wöchentlich neue Karten</h3>
      <LineChart width={400} height={200} data={stats.weekly.map(w=>({name: `KW${w._id.week}/${w._id.year}`, count: w.count}))}>
        <Line dataKey="count" />
        <XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/>
      </LineChart>
      <h3>Monatlich neue Karten</h3>
      <BarChart width={400} height={200} data={stats.monthly.map(m=>({name: `${m._id.month}/${m._id.year}`, count: m.count}))}>
        <Bar dataKey="count" fill="#8884d8" />
        <XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/>
      </BarChart>
      <h3>Meist favorisierte Karten</h3>
      <ul>
        {stats.mostFav.map(c=> <li key={c._id}>{c.title}: {c.favorites.length} Favoriten</li>)}
      </ul>
      <h3>Meist aufgerufene Karten</h3>
      <ul>
        {stats.mostViewed.map(c=> <li key={c._id}>{c.title}: {c.views} Aufrufe</li>)}
      </ul>
      <h3>Karten mit meisten Kommentaren</h3>
      <ul>
        {stats.mostCommented.map(c=> <li key={c._id}>{c._id}: {c.count} Kommentare</li>)}
      </ul>
    </div>
  );
}
