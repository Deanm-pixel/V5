import React, {useEffect, useState} from "react";
import api from "../api";
import useAuthStore from "../store/auth";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const {user} = useAuthStore();

  useEffect(() => {
    if (!user) return;
    api.get("/notifications").then(res => setNotifs(res.data.filter(n => !n.read)));
  }, [user]);

  if (!notifs.length) return null;
  return (
    <div style={{position:"fixed",top:0,right:0,background:"yellow",padding:10,zIndex:1000}}>
      <b>Benachrichtigungen:</b>
      <ul>
        {notifs.map(n => <li key={n._id}>{n.text}</li>)}
      </ul>
    </div>
  );
}
