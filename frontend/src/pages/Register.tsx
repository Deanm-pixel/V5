import React, {useState} from "react";
import api from "../api";
import {useNavigate} from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState(""); const [name, setName] = useState("");
  const [password, setPassword] = useState(""); const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", {email, password, name});
      navigate("/login");
    } catch (e) { setError(e.response?.data?.message || "Fehler"); }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrierung</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail" required />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Passwort" required />
      <button type="submit">Registrieren</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}
