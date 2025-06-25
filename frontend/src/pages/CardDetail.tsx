import React, {useEffect, useState} from "react";
import api from "../api";
import {useParams, Link} from "react-router-dom";
import useAuthStore from "../store/auth";
import ReactMarkdown from "react-markdown";

export default function CardDetail() {
  const {id} = useParams();
  const [card, setCard] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const {user} = useAuthStore();

  useEffect(() => {
    api.get(`/cards`, {params: {q: id}}).then(res => setCard(res.data.find(x=>x._id===id)));
    api.post(`/cards/${id}/view`);
    api.get(`/comments/${id}`).then(res => setComments(res.data));
  }, [id]);

  async function sendComment() {
    await api.post("/comments", {card: id, text: comment});
    setComment("");
    api.get(`/comments/${id}`).then(res => setComments(res.data));
  }
  async function deleteComment(cid) {
    await api.delete(`/comments/${cid}`);
    api.get(`/comments/${id}`).then(res => setComments(res.data));
  }

  if (!card) return <div>Lädt...</div>;
  return (
    <div>
      <h2>{card.title}</h2>
      <div>
        <ReactMarkdown>{card.content}</ReactMarkdown>
        <div>Tags: {card.tags.join(", ")}</div>
        <div>Erstellt von: {card.createdBy?.name}</div>
        <div>Favoriten: {card.favorites.length} 
          <button onClick={() => api.post(`/cards/${id}/fav`).then(()=>window.location.reload())}>Favorisieren</button>
        </div>
        {card.expiresAt && new Date(card.expiresAt) < new Date() && <div style={{color:"red"}}>Diese Karte ist abgelaufen!</div>}
        <Link to={`/cards/${id}/edit`}>Bearbeiten</Link>
      </div>
      <h3>Kommentare</h3>
      <ul>
        {comments.map(c => (
          <li key={c._id}>
            {c.text} <i>von {c.user.name}</i> 
            {(user.role === "admin" || user.role === "editor" || c.user._id === user.id) && (
              <button onClick={()=>deleteComment(c._id)}>Löschen</button>
            )}
          </li>
        ))}
      </ul>
      <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Kommentieren..." />
      <button onClick={sendComment}>Senden</button>
    </div>
  );
}
