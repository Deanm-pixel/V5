import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CardList from "./pages/CardList";
import CardDetail from "./pages/CardDetail";
import CardEdit from "./pages/CardEdit";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "./components/Notifications";
import useAuthStore from "./store/auth";

// Private Route Wrapper
function PrivateRoute({children, role}: {children: JSX.Element, role?: string}) {
  const {token, user} = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <div>Zugriff verweigert</div>;
  return children;
}

export default function App() {
  return (
    <>
      <Notifications />
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path="/cards" element={<PrivateRoute><CardList/></PrivateRoute>}/>
        <Route path="/cards/:id" element={<PrivateRoute><CardDetail/></PrivateRoute>}/>
        <Route path="/cards/:id/edit" element={<PrivateRoute><CardEdit/></PrivateRoute>}/>
        <Route path="/cards/new" element={<PrivateRoute><CardEdit/></PrivateRoute>}/>
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminPanel/></PrivateRoute>}/>
      </Routes>
    </>
  );
}
