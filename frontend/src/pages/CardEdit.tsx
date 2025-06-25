import React, {useEffect, useState} from "react";
import api from "../api";
import {useParams, useNavigate} from "react-router-dom";
import useAuthStore from "../store/auth";

export default function CardEdit() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>({title: "", content: "", tags: "", expiresAt: ""});
  const {user} = useAuthStore();

  useEffect(() => {
    if(id && id !== "new") api.get(`/cards`, {params: {q: id}})
      .then(res => setCard(res.data.find(x=>x._id===id)));
  }, [id]);

  async function handleSave() {
    if(id === "new") {
      await api.post("/cards", {...card, tags: card.tags.split(",")});
    } else {
      await api.put(`/cards/${id}`, {...card, tags: card.tags.split(",")});
    }
    navigate("/cards");
  }

  return (
    <div>
      <h2>{id === "new" ? "Neue Karte" : "Karte bearbeiten"}</h2>
      <input value={card.title} onChange={e=>setCard({...card, title: e.target.value})} placeholder="Titel" />
      <textarea value={card.content} onChange={e=>setCard({...card, content: e.target.value})} placeholder="Inhalt (Markdown)" />
      <input value={card.tags} onChange={e=>setCard({...card, tags: e.target.value})} placeholder="Tags (Komma-getrennt)" />
      <input type="date" value={card.expiresAt?.substring(0,10)} onChange={e=>setCard({...card, expiresAt: e.target.value})} />
      <button onClick={handleSave}>Speichern</button>
    </div>
  );
}
