import React, {useEffect, useState} from "react";
import api from "../api";
import {Link, useSearchParams} from "react-router-dom";
import useAuthStore from "../store/auth";

export default function CardList() {
  const [cards, setCards] = useState([]);
  const [q, setQ] = useState("");
  const [tags, setTags] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const {user} = useAuthStore();

  useEffect(() => {
    let param: any = {};
    if (q) param.q = q;
    if (tags) param.tags = tags;
    if (searchParams.get("fav")) param.fav = "1";
    api.get("/cards", {params: param}).then(res=>setCards(res.data));
  }, [q, tags, searchParams]);

  return (
    <div>
      <h2>Karten</h2>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Suche Titel/Inhalt..." />
      <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (Komma-getrennt)" />
      <Link to="/cards/new">+ Neue Karte</Link>
      <ul>
        {cards.map(card => (
          <li key={card._id}>
            <Link to={`/cards/${card._id}`}>{card.title}</Link>
            {" | "} Favoriten: {card.favorites.length}
            {card.expiresAt && new Date(card.expiresAt) < new Date() && <span style={{color:"red"}}> (Abgelaufen!)</span>}
            {user?.role !== "user" || card.createdBy._id === user.id
              ? <Link to={`/cards/${card._id}/edit`}>Bearbeiten</Link> 
              : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
