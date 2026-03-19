import React, { useState } from "react";
import "./VisitorLogin.css"; // pwede reuse css

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const adminAccounts = [
    { email: "jcesperanza@neu.edu.ph", password: "admin123" },
    { email: "kristinefaith.barsalote@neu.edu.ph", password: "admin123" }
  ];

  const handleLogin = () => {
    const isValid = adminAccounts.some(
      acc => acc.email === email && acc.password === password
    );

    if (!isValid) {
      setError("Invalid admin credentials.");
      return;
    }

    onLogin({ email, mode: "admin" });
  };

  return (
    <div className="login-bg">
      <h1>ADMIN LOGIN</h1>

      <div className="admin-box">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}