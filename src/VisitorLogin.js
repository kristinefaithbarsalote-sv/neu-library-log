import React from "react";
import "./VisitorLogin.css";

export default function VisitorLoginPage({ onUser, onAdmin }) {
  return (
    <div className="login-bg">
      <h1>NEU LIBRARY SYSTEM</h1>

      <button onClick={onUser}>ENTER EMAIL</button>

      <div className="toggle">
        <button onClick={onAdmin}>ADMIN</button>
      </div>
    </div>
  );
}