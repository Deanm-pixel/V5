import React from "react";
import {Link} from "react-router-dom";
import useAuthStore from "../store/auth";

export default function Dashboard() {
  const {user, logout} = useAuthStore();
  return (
    <div>
      <h1>Willkommen, {user?.name}</h1>
      <nav>
        <Link to="/cards">Karten durchsuchen</Link> |{" "}
        <Link to="/cards/new">Neue Karte</Link> |{" "}
        <Link to="/cards?fav=1">Meine Favoriten</Link>
        {user?.role === "admin" && <> | <Link to="/admin">Admin-Panel</Link></>}
      </nav>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
