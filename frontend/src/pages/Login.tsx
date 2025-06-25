import React, {useState} from "react";
import api from "../api";
import useAuthStore from "../store/auth";
import {useNavigate} from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", {email, password});
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAuth(token, {id: payload.id, email: payload.email, name: payload.name, role: payload.role});
      navigate("/");
    } catch (e) { setError(e.response?.data?.message || "Fehler"); }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail" required />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Passwort" required />
      <button type="submit">Login</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}
